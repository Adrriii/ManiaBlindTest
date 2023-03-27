import { Mapset } from '@/lib/db/beatmap';
import type { NextApiRequest, NextApiResponse } from 'next';
import mapsets from '@/lib/memory/mapsets';
import { getEmptySearchResults, SearchResults } from '@/lib/types/search_results';



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

	function getSongString(mapset:Mapset): string {
		return `${mapset.artist} - ${mapset.title}`;
	}

	function checkSameSong(mapsets: Mapset[], mapset: Mapset): boolean {
		return mapsets.some((set) => wordMatch(getSongString(set), getSongString(mapset)));
	}
	
	mapsets.all_mapsets.forEach((mapset, ) => {
		if(results.titles.length < cat_limit && wordMatch(search, mapset.title) && !checkSameSong(results.titles, mapset)) {
			results.titles.push(mapset);
		}
		if(results.artists.length < cat_limit && wordMatch(search, mapset.artist) && !checkSameSong(results.artists, mapset)) {
			results.artists.push(mapset);
		}
	})

	res.status(200).json(results);
}
