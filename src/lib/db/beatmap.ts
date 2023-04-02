export type Mapset = {
	beatmapset_id: number,
	beatmaps: Beatmap[],
	title: string,
	artist: string,
	creator: string,
	total_length: number,
	approved_date: string,
	approved: number
}

export type Beatmap = {
	beatmap_id: number,
	beatmapset_id: number,
	mode: number,
	artist: string,
	creator: string,
	difficultyrating: number,
	diff_size: number,
	diff_overall: number,
	diff_approach: number,
	diff_drain: number,
	total_length: number,
	approved_date: string,
	title: string,
	version: string,
	approved: number
}

export type SongBeatmap = {
	beatmap_id: number,
	beatmapset_id: number,
	hash_id: string,
	difficultyrating: number,
	approved_date: string,
}