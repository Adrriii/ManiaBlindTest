import type { NextApiRequest, NextApiResponse } from 'next';
import { UserInfo } from '@/lib/types/user_info';
import { ApiError } from '@/lib/types/api_error';
import { getTopUsers } from '@/lib/db/user';

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse<UserInfo[] | ApiError>
) {
	const { page } = req.query as unknown as { page?: number };
	res.status(200).json(await getTopUsers(page));
}
