import { Mapset } from '@/lib/db/beatmap';
import type { NextApiRequest, NextApiResponse } from 'next';
import mapsets from '@/lib/memory/mapsets';
import { getEmptySearchResults, SearchResults } from '@/lib/types/search_results';
import { Song } from '@/lib/db/song';



export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse<SearchResults>
) {
	const search = req.body as string;
	const cat_limit = 5;
	
	const results = getEmptySearchResults();

	function wordMatch(search: string, string: string): boolean {
		return string.toLowerCase().includes(search.toLowerCase());
	}

	function wordEqual(search: string, string: string): boolean {
		return string.toLowerCase() === search.toLowerCase();
	}

	function songEqual(set: Song, mapset: Song): boolean {
		return set.hash_id === mapset.hash_id || wordEqual(getSongString(set), getSongString(mapset));
	}

	function getSongString(mapset: Song): string {
		return `${mapset.artist} - ${mapset.title}`;
	}

	function checkSameSong(mapsets: Song[], mapset: Song): boolean {
		return mapsets.some((set) => songEqual(set, mapset));
	}
	
	mapsets.search_base.forEach((song, ) => {
		if(checkSameSong(results.titles, song)) return;
		if(checkSameSong(results.artists, song)) return;
		if(results.titles.length < cat_limit && wordMatch(search, song.title)) {
			results.titles.push(song);
			return;
		}
		if(results.artists.length < cat_limit && wordMatch(search, song.artist)) {
			results.artists.push(song);
			return;
		}
	})

	res.status(200).json(results);
}
