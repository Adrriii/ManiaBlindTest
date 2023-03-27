import query from "../db/db";
import { Beatmap, Mapset } from "../db/beatmap";
import { Song } from "../db/song";

export class Mapsets {
	
	search_base: Map<number, Song>;
	mapsets: Map<number, Mapset>;	

	constructor() {
		this.search_base = new Map();
		this.mapsets = new Map();
	}

	async getMapset(mapset_id: number): Promise<Mapset | null> {
		return this.mapsets.has(mapset_id) ?
			this.mapsets.get(mapset_id) as Mapset :
			await this.fetchMapset(mapset_id);
	}

	async initAll() {
		(await query('SELECT * FROM song WHERE nomp3 = 0', [], 'blindtest') as Song[]).forEach((song) => {
			this.search_base.set(song.beatmapset_id, song);
		});
	}

	private async fetchMapset(mapset_id: number): Promise<Mapset | null> {
		const beatmaps = (await query(`SELECT * FROM osu_allbeatmaps WHERE mode = 3 AND approved_date > "2005-01-01" AND beatmapset_id = ${mapset_id}`)) as Beatmap[];
		if(beatmaps.length === 0) return null;
		
		const mapset = this.mergeBeatmapToMapset(beatmaps[0]);
		mapset.beatmaps = beatmaps;

		this.mapsets.set(mapset.beatmapset_id, mapset);

		return mapset;
	}

	private mergeBeatmapToMapset(beatmap: Beatmap): Mapset {
		return {
			beatmapset_id: beatmap.beatmapset_id,
			beatmaps: [],
			title: beatmap.title,
			artist: beatmap.artist,
			creator: beatmap.creator,
			total_length: beatmap.total_length,
			approved_date: beatmap.approved_date,
			approved: beatmap.approved
		} as Mapset;
	}
}

const mapsets = new Mapsets();
mapsets.initAll();

export default mapsets;