import type { NextApiRequest, NextApiResponse } from 'next';

import { getUserInfo, UserInfo } from '@/lib/types/user_info';
import { ApiError, InvalidParameter, UserNotFound } from '@/lib/types/api_error';

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse<UserInfo | ApiError>
) {
	const { osu_id } = req.query as unknown as { osu_id: string };
	
	let osu_id_param : number;

	try {
		osu_id_param = parseInt(osu_id);
	} catch(e) {
		res.status(404).json(InvalidParameter);
		return;
	}

	if(osu_id_param > 0) {
		res.status(200).json(await getUserInfo(osu_id_param));
	} else {
		res.status(404).json(UserNotFound);
	}
}
