import type { NextApiRequest, NextApiResponse } from 'next';
import { getCurrentUserInfo, UserInfo } from '@/lib/types/user_info';
import { getCookie } from 'cookies-next';
import { ApiError, UserNotFound } from '@/lib/types/api_error';

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse<UserInfo | ApiError>
) {
	const auth_token = getCookie(process.env.NEXT_PUBLIC_AUTH_COOKIE as string, { req, res })?.valueOf();

	if(typeof auth_token === 'string') {
		res.status(200).json(await getCurrentUserInfo(auth_token));
	} else {
		res.status(404).json(UserNotFound);
	}
}
