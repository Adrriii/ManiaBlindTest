import type { NextApiRequest, NextApiResponse } from 'next';
import games from '../../lib/memory/games';
import { SongFilters } from '@/lib/types/next_song_params';

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse<number>
) {	
	res.status(200).json(await games.getFiltersNbResults(req.body as SongFilters));
}
