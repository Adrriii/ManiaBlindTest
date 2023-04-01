import { Grades } from "../types/score";
import { UserInfo } from "../types/user_info";
import query from "./db"
import { UserStats } from "./user_stats";

export type User = {
	osu_id: number,
	access_token: string,
	refresh_token: string,
	username?: string,
	profile_picture?: string,
}

export async function CreateOrRefreshUserToken(user: User) {
	const values: string[] = [
		user.osu_id.toString(),
		user.access_token,
		user.refresh_token,
		user.username as string,
		user.profile_picture as string,
	];
	await query('REPLACE INTO user (osu_id, access_token, refresh_token, username, profile_picture) VALUES (?,?,?,?,?)', values, 'blindtest');
	await query('INSERT INTO user_stats (osu_id) VALUES (?) ON DUPLICATE KEY UPDATE osu_id=osu_id', [user.osu_id.toString()], 'blindtest');
}

export async function getUserFromOsuId(osu_id: number) {
	const values = [osu_id.toString()];

	return (await query('SELECT * FROM user WHERE osu_id = ?', values, 'blindtest') as User[])[0];
}

export async function getTopUsers(page = 1): Promise<(UserInfo & UserStats)[]> {
	const limit = 50;
	const offset = (page - 1) * limit;

	const grades_desc = Grades.map(grade => ` grades_${grade} DESC`);

	return await query(`SELECT * FROM user u, user_stats s WHERE u.osu_id = s.osu_id ORDER BY wins DESC, ${grades_desc} LIMIT ${limit} OFFSET ${offset}`, [], 'blindtest') as (UserInfo & UserStats)[];
}