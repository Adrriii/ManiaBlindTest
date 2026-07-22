import query from "./db"

export type ReportResult = 'ok' | 'same_song' | 'unknown_song' | 'already_merged' | 'ignored';

async function hashOfMapset(beatmapset_id: number): Promise<string | null> {
	const rows = await query(
		'SELECT hash_id FROM song WHERE beatmapset_id = ?',
		[beatmapset_id.toString()],
		'blindtest'
	) as { hash_id: string }[];

	return rows.length > 0 ? rows[0].hash_id : null;
}

export async function reportSamePair(osu_id: number, guess_mapset: number, answer_mapset: number): Promise<ReportResult> {
	const guess_hash = await hashOfMapset(guess_mapset);
	const answer_hash = await hashOfMapset(answer_mapset);

	if(guess_hash === null || answer_hash === null) return 'unknown_song';
	if(guess_hash === answer_hash) return 'same_song';

	const [hash_a, hash_b] = guess_hash < answer_hash ? [guess_hash, answer_hash] : [answer_hash, guess_hash];

	const ignored = await query(
		'SELECT 1 FROM song_pair_ignored WHERE hash_a = ? AND hash_b = ?',
		[hash_a, hash_b],
		'blindtest'
	);
	if(ignored.length > 0) return 'ignored';

	await query(
		'INSERT IGNORE INTO song_report (osu_id, hash_a, hash_b) VALUES (?,?,?)',
		[osu_id.toString(), hash_a, hash_b],
		'blindtest'
	);

	return 'ok';
}
