import { createContext, Dispatch, SetStateAction } from "react";
import { User } from "../db/user";
import { getEmptyUserInfo, UserInfo } from "../types/user_info";
import { randomUUID } from 'crypto';
import sha256 from 'sha256';

type UserContextType = {
	userInfo: UserInfo | null,
	setUserInfo: Dispatch<SetStateAction<UserInfo | null>>
}

export function bakeUserCookie(user: User): string {
	const id = randomUUID();
	const log_cookie = `${user.osu_id}:${id}`;
	const mac = sha256(`${log_cookie}:${process.env.AUTH_SALT}`);
	return `${log_cookie}:${mac}`;
}

export function checkUserCookie(cookie: string) {
	const parts = cookie.split(':');

	return sha256(`${parts[0]}:${parts[1]}:${process.env.AUTH_SALT}`) === parts[2];
}

export function InitUserContext(setUserInfo: Dispatch<SetStateAction<UserInfo | null>>, osu_id: number | 'me' = 'me') {
	fetch(`/api/user/${osu_id}`).then((data: Response) => {
		if(data.status !== 200) {
			setUserInfo(getEmptyUserInfo());
			return;
		}

		data.json().then((userInfo: UserInfo) => {
			setUserInfo(userInfo);
		});
	});
}

export const UserContext = createContext<UserContextType>({
	userInfo: getEmptyUserInfo(),
	setUserInfo: () => { return; }
});
