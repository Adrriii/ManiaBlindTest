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

	function getSongString(mapset: Song): string {
		return `${mapset.artist} - ${mapset.title}`;
	}

	function checkSameSong(mapsets: Song[], mapset: Song): boolean {
		return mapsets.some((set) => wordMatch(getSongString(set), getSongString(mapset)));
	}
	
	mapsets.search_base.forEach((song, ) => {
		if(results.titles.length < cat_limit && wordMatch(search, song.title) && !checkSameSong(results.titles, song)) {
			results.titles.push(song);
		}
		if(results.artists.length < cat_limit && wordMatch(search, song.artist) && !checkSameSong(results.artists, song)) {
			results.artists.push(song);
		}
	})

	res.status(200).json(results);
}
