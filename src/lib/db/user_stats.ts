import query from "./db"

export type UserStats = {
	osu_id: number,
	wins: number,
}

export async function getUserStats(osu_id: number): Promise<UserStats | null> {
	const results = await query('SELECT * FROM user_stats WHERE osu_id = ?', [osu_id.toString()], 'blindtest') as UserStats[];
	return results.length > 0 ? results[0] : null;
}

export async function addUserWin(osu_id: number) {
	query('UPDATE user_stats SET wins = wins + 1 WHERE osu_id = ?', [osu_id.toString()], 'blindtest');
}

export function getEmptyUserStats(): UserStats {
	return {
		osu_id: -1,
		wins: -1
	};
}