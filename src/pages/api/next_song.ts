import type { NextApiRequest, NextApiResponse } from 'next';
import { GameInfo } from '../../lib/types/game_info';
import games from '../../lib/memory/games';
import { NextSongParams } from '@/lib/types/next_song_params';
import { getCookie } from 'cookies-next';
import { getCurrentUserInfo } from '@/lib/types/user_info';

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse<GameInfo>
) {	
	const auth_token = getCookie(process.env.NEXT_PUBLIC_AUTH_COOKIE as string, { req, res })?.valueOf() as string | undefined;
	
	const userInfo = await getCurrentUserInfo(auth_token);
	
	res.status(200).json(await games.newGame(req.body as NextSongParams, userInfo));
}
