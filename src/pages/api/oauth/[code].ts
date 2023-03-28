import type { NextApiRequest, NextApiResponse } from 'next';
import { ApiError, InvalidOauth, InvalidOsuUser } from '@/lib/types/api_error';
import { getEmptyUserInfo, UserInfo } from '@/lib/types/user_info';
import { OsuApiToken } from '@/lib/osu_api/token';
import { CreateOrRefreshUserToken, User } from '@/lib/db/user';
import { OsuApiMe } from '@/lib/osu_api/me';
import { setCookie } from 'cookies-next';
import { bakeUserCookie } from '@/lib/contexts/user_context';
import { getEmptyUserStats } from '@/lib/db/user_stats';

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse<UserInfo | ApiError>
) {
	const { code } = req.query as unknown as { code: number };
	
	(new OsuApiToken()).call(code).then((token) => {
		const user: User = {
			osu_id: -1,
			access_token: token.access_token,
			refresh_token: token.refresh_token,
		};

		(new OsuApiMe()).call(user).then((osuUser) => {
			user.osu_id = osuUser.id;
			user.username = osuUser.username;
			user.profile_picture = osuUser.avatar_url;

			CreateOrRefreshUserToken(user);

			const log_cookie = bakeUserCookie(user);
			const cookie_name = process.env.NEXT_PUBLIC_AUTH_COOKIE as string;
			
			setCookie(cookie_name, log_cookie, { req, res });			

			const userInfo: UserInfo = {
				osu_id: user.osu_id,
				username: user.username,
				profile_picture: user.profile_picture,
				user_stats: getEmptyUserStats()				
			}

			res.status(200).json(userInfo);
		}).catch((data) => {
			res.status(404).json(InvalidOsuUser);
		})
	}).catch((data) => {
		res.status(404).json(InvalidOauth);
	});
}
