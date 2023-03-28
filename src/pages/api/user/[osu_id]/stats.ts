import { getUserStats, UserStats } from '@/lib/db/user_stats';
import { ApiError, UserNotFound } from '@/lib/types/api_error';
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse<UserStats | ApiError>
) {
	const { osu_id } = req.query as unknown as { osu_id: number };
	const results = await getUserStats(osu_id);

	if(results) {
		res.status(200).json(results);
	} else {
		res.status(404).json(UserNotFound);
	}
}
