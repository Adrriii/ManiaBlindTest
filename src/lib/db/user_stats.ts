import { ScoreGrade } from "../types/score";
import query from "./db"

export type UserStats = {
	osu_id: number,
	wins: number,
	losses: number,
	grades_X: number,
	grades_SS: number,
	grades_S: number,
	grades_A: number,
	grades_B: number,
	grades_C: number,
	grades_D: number,
	grades_F: number,
}

export async function getUserStats(osu_id: number): Promise<UserStats | null> {
	const results = await query('SELECT * FROM user_stats WHERE osu_id = ?', [osu_id.toString()], 'blindtest') as UserStats[];
	return results.length > 0 ? results[0] : null;
}

export async function addUserWin(osu_id: number) {
	query('UPDATE user_stats SET wins = wins + 1 WHERE osu_id = ?', [osu_id.toString()], 'blindtest');
}

export async function addUserLoss(osu_id: number) {
	query('UPDATE user_stats SET losses = losses + 1 WHERE osu_id = ?', [osu_id.toString()], 'blindtest');
}

export async function changeUserGradeBy(osu_id: number, grade: ScoreGrade, amount: number) {
	const grade_db = `grades_${grade}`;
	
	query(`UPDATE user_stats SET ${grade_db} = ${grade_db} + (${amount}) WHERE osu_id = ?`, [osu_id.toString()], 'blindtest');
}

export function getEmptyUserStats(): UserStats {
	return {
		osu_id: -1,
		wins: -1,
		losses: -1,
		grades_X: -1,
		grades_SS: -1,
		grades_S: -1,
		grades_A: -1,
		grades_B: -1,
		grades_C: -1,
		grades_D: -1,
		grades_F: -1,
	};
}