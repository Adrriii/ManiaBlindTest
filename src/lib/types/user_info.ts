import { checkUserCookie, getUserFromCookie } from '../contexts/user_context';
import { User } from '../db/user';
import { getEmptyUserStats, getUserStats, UserStats } from '../db/user_stats';

export type UserInfo = {
	osu_id: number,
	username: string,
	profile_picture: string,
	user_stats: UserStats
}

function fromUser(user: User): UserInfo {
	return {
		osu_id: user.osu_id,
		username: user.username as string,
		profile_picture: user.profile_picture as string,
		user_stats: getEmptyUserStats()
	}
}

export function getEmptyUserInfo(): UserInfo {
	return {
		osu_id: -1,
		username: '',
		profile_picture: '',
		user_stats: {
			osu_id: -1,
			wins: -1
		}
	}
}

export async function getCurrentUserInfo(auth_cookie: string | undefined): Promise<UserInfo> {
	if(typeof auth_cookie !== 'string') return getEmptyUserInfo();
	if(!checkUserCookie(auth_cookie)) return getEmptyUserInfo();

	const userInfo = fromUser(await getUserFromCookie(auth_cookie));
	if(userInfo.osu_id > 0) {
		const userStats = await getUserStats(userInfo.osu_id);
		if(userStats !== null) {
			userInfo.user_stats = userStats;
		}
	}
	return userInfo;
}