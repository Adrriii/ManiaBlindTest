import query from "./db"

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