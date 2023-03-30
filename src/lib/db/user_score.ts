import { ScoreFull } from "../types/score";
import { fromUser, UserInfo } from "../types/user_info";
import query from "./db"
import { getSongFromHashId } from "./song";
import { getUserFromOsuId } from "./user";

export type UserScore = {
	osu_id: number,
	hash_id: string,
	score_date: number,
	score: number,
	hints_used: number,
	time_ms: number
}

export function addUserScore(userScore: Omit<UserScore, 'score_date'>, with_replace = true) {
	const values: string[] = [
		userScore.osu_id.toString(),
		userScore.hash_id,
		userScore.score.toString(),
		userScore.hints_used.toString(),
		userScore.time_ms.toString(),
	];
	const base_query = '(osu_id, hash_id, score, hints_used, time_ms) VALUES (?,?,?,?,?)';

	if(with_replace) query(`REPLACE INTO user_score ${base_query}`, values, 'blindtest');
	query(`INSERT INTO user_score_all ${base_query}`, values, 'blindtest');
}

export async function getUserScore(osu_id: number, hash_id: string): Promise<UserScore | null> {
	const results = await query('SELECT * FROM user_score WHERE osu_id = ? AND hash_id = ?', [osu_id.toString(), hash_id], 'blindtest') as UserScore[];
	return results.length > 0 ? results[0] : null;
}

export async function getSongScores(hash_id: string): Promise<UserScore[]> {
	return await query('SELECT * FROM user_score WHERE hash_id = ?', [hash_id], 'blindtest') as UserScore[];
}
export async function getUserScores(osu_id: number): Promise<UserScore[]> {
	return await query('SELECT * FROM user_score WHERE osu_id = ?', [osu_id.toString()], 'blindtest') as UserScore[];
}
export async function getUserBestScores(osu_id: number, page: number = 1): Promise<{scores: UserScore[], has_more: boolean}> {
	const limit = 5;
	const offset = (page - 1) * limit;

	const results = await query(`SELECT * FROM user_score WHERE osu_id = ? ORDER BY score DESC, time_ms ASC, hints_used ASC, score_date ASC LIMIT ${limit +1} OFFSET ${offset}`, [osu_id.toString()], 'blindtest') as UserScore[];

	return {
		scores: results.slice(0, limit),
		has_more: results.length > limit
	}
}
export async function getUserRecentScores(osu_id: number, page: number = 1): Promise<{scores: UserScore[], has_more: boolean}> {
	const limit = 5;
	const offset = (page - 1) * limit;
	const results = await query(`SELECT * FROM user_score_all WHERE osu_id = ? ORDER BY score_date DESC LIMIT ${limit+1} OFFSET ${offset}`, [osu_id.toString()], 'blindtest') as UserScore[];

	return {
		scores: results.slice(0, limit),
		has_more: results.length > limit
	}
}
export async function getFullScore(base_score: UserScore, user: UserInfo | null = null): Promise<ScoreFull> {
	
	return {
		score: base_score,
		user: user ? user : fromUser(await getUserFromOsuId(base_score.osu_id)),
		song: await getSongFromHashId(base_score.hash_id)
	}
}