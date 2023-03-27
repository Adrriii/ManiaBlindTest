import { Mapset } from "../db/beatmap";

export type SearchResults = {
	titles: Mapset[],
	artists: Mapset[],
}

export function getEmptySearchResults(): SearchResults {
	return {
		titles: [],
		artists: [],
	}
}