import type { NextApiRequest, NextApiResponse } from 'next';

import { getUserInfo, UserInfo } from '@/lib/types/user_info';
import { ApiError, UserNotFound } from '@/lib/types/api_error';

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse<UserInfo | ApiError>
) {
	const { osu_id } = req.query as unknown as { osu_id: number };

	if(typeof osu_id === 'number') {
		res.status(200).json(await getUserInfo(osu_id));
	} else {
		res.status(404).json(UserNotFound);
	}
}
