import { createContext, Dispatch, SetStateAction } from "react";
import { User } from "../db/user";
import { getEmptyUserInfo, UserInfo } from "../types/user_info";
import { randomUUID } from 'crypto';
import sha256 from 'sha256';
import query from "../db/db";

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

export async function getUserFromCookie(cookie: string) {
	const parts = cookie.split(':');
	const values = [parts[0]];

	return (await query('SELECT * FROM user WHERE osu_id = ?', values, 'blindtest') as User[])[0];
}

export const UserContext = createContext<UserContextType>({
	userInfo: getEmptyUserInfo(),
	setUserInfo: () => { return; }
});