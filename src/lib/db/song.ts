import query from "./db";

export type Song = {
	beatmapset_id: number,
	hash_id: string,
	nomp3: boolean,
	title: string,
	artist: string,
}

export async function getSongFromHashId(hash_id: string) {
	const values = [hash_id];

	return (await query('SELECT * FROM song WHERE hash_id = ?', values, 'blindtest') as Song[])[0];
}