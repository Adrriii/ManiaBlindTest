import games from '../../../lib/memory/games';
import { GameId, GameInfo } from '../../../lib/types/game_info';
import type { NextApiRequest, NextApiResponse } from 'next';
import { ApiError, GameNotFound, InvalidGame } from '@/lib/types/api_error';

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse<GameInfo | ApiError>
) {
	const { game } = req.query;
	const serverGame = games.getGame(game as GameId);
	if(serverGame === null) {
		res.status(404).json(GameNotFound);
		return;
	}

	const gameInfo = serverGame.game as GameInfo;
	if(gameInfo === null) {
		res.status(404).json(InvalidGame);
		return;
	}
	
	res.status(200).json(games.setNextHint(gameInfo, true));
}
