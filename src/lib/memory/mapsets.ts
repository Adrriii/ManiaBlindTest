import query from "../db/db";
import { Beatmap, Mapset } from "../db/beatmap";

export class Mapsets {
	
	all_mapsets: Map<number, Mapset>;
	mapsets: Map<number, Mapset>;	

	constructor() {
		this.all_mapsets = new Map();
		this.mapsets = new Map();
	}

	async getMapset(mapset_id: number): Promise<Mapset | null> {
		return this.mapsets.has(mapset_id) ?
			this.mapsets.get(mapset_id) as Mapset :
			await this.fetchMapset(mapset_id);
	}

	async initAll() {
		(await query('SELECT * FROM osu_allbeatmaps WHERE mode = 3 AND approved_date > "2005-01-01" GROUP BY beatmapset_id', [], 'stats') as Beatmap[]).forEach((beatmap) => {
			this.all_mapsets.set(beatmap.beatmapset_id, this.mergeBeatmapToMapset(beatmap));
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