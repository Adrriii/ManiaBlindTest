import games from '../../../lib/memory/games';
import { GameId, GameInfo } from '../../../lib/types/game_info';
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse<GameInfo | object>
) {
	const { game } = req.query;
	const gameInfo = games.getGame(game as GameId)?.game as GameInfo;

	if(gameInfo === null) {
		res.status(404).json({error: 'Invalid game'});
		return;
	}
	
	res.status(200).json(games.setNextHint(gameInfo, true));
}
