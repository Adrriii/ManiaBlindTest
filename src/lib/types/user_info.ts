import { checkUserCookie } from '../contexts/user_context';
import { getUserFromOsuId, User } from '../db/user';
import { getUserStats, UserStats } from '../db/user_stats';

export type UserInfo = {
	osu_id: number,
	username: string,
	profile_picture: string,
	user_stats?: UserStats,
}

export function fromUser(user: User): UserInfo {
	return {
		osu_id: user.osu_id,
		username: user.username as string,
		profile_picture: user.profile_picture as string
	}
}

export function getEmptyUserInfo(): UserInfo {
	return {
		osu_id: -1,
		username: '',
		profile_picture: ''
	}
}

export async function getUserInfo(osu_id: number): Promise<UserInfo> {
	const userInfo = fromUser(await getUserFromOsuId(osu_id));
	if(userInfo.osu_id > 0) {
		const userStats = await getUserStats(userInfo.osu_id);
		if(userStats !== null) {
			userInfo.user_stats = userStats;
		}
	}
	return userInfo;
}

export async function getCurrentUserInfo(auth_cookie: string | undefined): Promise<UserInfo> {
	if(typeof auth_cookie !== 'string') return getEmptyUserInfo();
	if(!checkUserCookie(auth_cookie)) return getEmptyUserInfo();
	
	const parts = auth_cookie.split(':');

	return getUserInfo(parseInt(parts[0]));
}