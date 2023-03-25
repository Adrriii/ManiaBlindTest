import type { NextApiRequest, NextApiResponse } from 'next';
import { GameInfo } from '../types/game_info';
import games from '../memory/games';

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse<GameInfo>
) {
	res.status(200).json(await games.newGame());
}
