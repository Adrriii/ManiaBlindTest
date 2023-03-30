import type { NextApiRequest, NextApiResponse } from 'next';
import { GameInfo } from '../../lib/types/game_info';
import games from '../../lib/memory/games';
import { ApiError, GameNotFound } from '@/lib/types/api_error';
import { getCurrentUserInfo } from '@/lib/types/user_info';
import { getCookie } from 'cookies-next';

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse<GameInfo | ApiError>
) {	
	const auth_token = getCookie(process.env.NEXT_PUBLIC_AUTH_COOKIE as string, { req, res })?.valueOf() as string | undefined;
	
	const userInfo = await getCurrentUserInfo(auth_token);
	
	const guess = await games.makeGuess(req.body as GameInfo, userInfo);

	if(guess === null) {		
		res.status(404).json(GameNotFound);
		return;
	}
	res.status(200).json(guess);
}
