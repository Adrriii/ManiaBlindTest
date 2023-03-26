import { Mapset } from "../db/beatmap";
import query from "../db/db";
import { Song } from "../db/song";
import mapsets from "./mapsets";

export class ServerSong {

	mapsets: Map<number, Mapset>;

	constructor(
		public song: Song
	) {
		this.mapsets = new Map();
	}

	async init() {
		await this.initMapsets();

		return this;
	}

	initMapsets() {
		const calls: Promise<unknown>[] = [];

		calls.push(
			new Promise<void>((resolve) => {
				(query(
					'SELECT beatmapset_id FROM song WHERE hash_id = ?',
					[this.song.hash_id],
					'blindtest'
				) as Promise<Pick<Song, 'beatmapset_id'>[]>)
				.then((results) => {
					results.forEach((result) => {
						mapsets.getMapset(result.beatmapset_id).then((mapset) => {
							if(mapset !== null) {
								this.mapsets.set(mapset.beatmapset_id, mapset);
							}
							resolve();
						});
					});
				})
			})
		);

		return Promise.all(calls);
	}

	getSome(): Mapset {
		return this.mapsets.get(this.mapsets.keys().next().value) as Mapset;
	}
}