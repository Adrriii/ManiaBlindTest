import type { NextApiRequest, NextApiResponse } from 'next';
import { getCookie } from 'cookies-next';

import { ApiError } from '@/lib/types/api_error';
import { ScoreFull } from '@/lib/types/score';
import { getFullScore, getSongScores } from '@/lib/db/user_score';
import { getCurrentUserInfo } from '@/lib/types/user_info';

export type ScoresResponse = {
	scores: ScoreFull[],
	own_score?: ScoreFull
}

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse<ScoresResponse | ApiError>
) {
	const { hash_id, page } = req.query as unknown as { hash_id: string, page?: number };
	const response: ScoresResponse = {
		scores: []
	}

	response.scores = await Promise.all((await getSongScores(hash_id, page)).map(async score => await getFullScore(score)));
	response.scores = response.scores.sort((a,b) => {
		return a.score.score > b.score.score 
			|| a.score.time_ms < b.score.time_ms
			|| a.score.hints_used < b.score.hints_used
			|| a.score.score_date < b.score.score_date ? -1 : 1;
	})
	
	const auth_token = getCookie(process.env.NEXT_PUBLIC_AUTH_COOKIE as string, { req, res })?.valueOf() as string | undefined;
	
	const userInfo = await getCurrentUserInfo(auth_token);
	response.own_score = response.scores.find(score => score.user.osu_id === userInfo.osu_id);

	res.status(200).json(response);
}
