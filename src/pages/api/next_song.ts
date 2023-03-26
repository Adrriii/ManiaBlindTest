import type { NextApiRequest, NextApiResponse } from 'next';
import { GameInfo } from '../../lib/types/game_info';
import games from '../../lib/memory/games';
import { NextSongParams } from '@/lib/types/next_song_params';

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse<GameInfo>
) {
	const { filters } = req.body as NextSongParams;
	
	res.status(200).json(await games.newGame(filters));
}
