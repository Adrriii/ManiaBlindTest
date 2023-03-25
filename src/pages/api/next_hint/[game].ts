import games from '@/pages/memory/games';
import { GameId, GameInfo } from '@/pages/types/game_info';
import type { NextApiRequest, NextApiResponse } from 'next';

function setNextHint(current: GameInfo): GameInfo {
	return current;
}
export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse<GameInfo>
) {
	const { gameId } = req.query;
	const gameInfo = games.getGame(gameId as GameId);

	if(gameInfo === null) {
		res.status(404);
		return;
	}
	
	res.status(200).json(setNextHint(gameInfo));
}
