import query from "./db"

export async function addUserSkip(osu_id: number, hash_id: string, beatmapset_id: number) {
	const values = [osu_id.toString(), hash_id, beatmapset_id.toString()];

	await query(
		'INSERT INTO user_skip (osu_id, hash_id, beatmapset_id) VALUES (?,?,?) \
		ON DUPLICATE KEY UPDATE skips = skips + 1, skip_date = CURRENT_TIMESTAMP',
		values,
		'blindtest'
	);
}
