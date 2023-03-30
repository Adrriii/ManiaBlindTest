import type { NextApiRequest, NextApiResponse } from 'next';

import { ApiError, InvalidParameter, UserNotFound } from '@/lib/types/api_error';
import { ScoreFull } from '@/lib/types/score';
import { getFullScore, getUserRecentScores } from '@/lib/db/user_score';
import { getUserFromOsuId } from '@/lib/db/user';
import { fromUser } from '@/lib/types/user_info';

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse<ScoreFull[] | ApiError>
) {
	const { osu_id, page } = req.query as unknown as { osu_id: string, page?: number };
	
	let osu_id_param : number;

	try {
		osu_id_param = parseInt(osu_id);
	} catch(e) {
		res.status(404).json(InvalidParameter);
		return;
	}

	const user = fromUser(await getUserFromOsuId(osu_id_param));

	if(user.osu_id > 0) {
		const { scores, has_more } = await getUserRecentScores(user.osu_id, page);
		const user_scores_full = await Promise.all(scores.map(async (score) => await getFullScore(score, user)));

		res.status(has_more ? 207 : 200).json(user_scores_full);
	} else {
		res.status(404).json(UserNotFound);
	}
}
