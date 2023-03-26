import query from "../db/db";
import { Beatmap, Mapset } from "../db/beatmap";

export class Mapsets {
	
	mapsets: Map<number, Mapset>;	

	constructor() {
		this.mapsets = new Map();
	}

	async getMapset(mapset_id: number): Promise<Mapset> {
		return this.mapsets.has(mapset_id) ?
			this.mapsets.get(mapset_id) as Mapset :
			await this.fetchMapset(mapset_id);
	}

	private async fetchMapset(mapset_id: number): Promise<Mapset> {
		const beatmaps = (await query(`SELECT * FROM osu_allbeatmaps WHERE mode = 3 AND approved_date > "2005-01-01" AND beatmapset_id = ${mapset_id}`)) as Beatmap[];
		
		const mapset = {
			beatmapset_id: beatmaps[0].beatmapset_id,
			beatmaps: beatmaps,
			title: beatmaps[0].title,
			artist: beatmaps[0].artist,
			creator: beatmaps[0].creator,
			total_length: beatmaps[0].total_length,
			approved_date: beatmaps[0].approved_date,
			approved: beatmaps[0].approved
		} as Mapset;

		this.mapsets.set(mapset.beatmapset_id, mapset);

		return mapset;
	}
}

const mapsets = new Mapsets();

export default mapsets;