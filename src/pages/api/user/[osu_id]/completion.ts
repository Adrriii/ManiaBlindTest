import { getUserCompletion, UserCompletion } from '@/lib/db/user_score';
import { ApiError, UserNotFound } from '@/lib/types/api_error';
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse<UserCompletion[] | ApiError>
) {
	const { osu_id } = req.query as unknown as { osu_id: number };
	const results = await getUserCompletion(osu_id);

	if(results) {
		res.status(200).json(results);
	} else {
		res.status(404).json(UserNotFound);
	}
}
