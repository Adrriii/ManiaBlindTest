import { Mapset } from "../db/beatmap";
import { Song } from "../db/song";

export type SearchResults = {
	titles: Song[],
	artists: Song[],
}

export function getEmptySearchResults(): SearchResults {
	return {
		titles: [],
		artists: [],
	}
}