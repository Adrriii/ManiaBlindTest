import { UserContext } from '@/lib/contexts/user_context';
import styles from '@/styles/modules/header.module.css'
import { removeCookies } from 'cookies-next';
import { useContext, useEffect } from 'react';

export default function Header() {
	const {userInfo, setUserInfo} = useContext(UserContext);
	const client_id = process.env.NEXT_PUBLIC_OSU_CLIENT_ID;
	const oauth_url = `https://osu.ppy.sh/oauth/authorize?response_type=code&client_id=${client_id}&scope=identify%20public&redirect_uri=https://blindtest.rhythmgamers.net/oauth`;
	
	function logout() {
		removeCookies(process.env.NEXT_PUBLIC_AUTH_COOKIE as string);
		window.location.reload();
	}

	return (<>
		<div className={styles.header}>
			<div className={styles.header_logo}>osu!mania blind test</div>
			{
				userInfo?.osu_id === -1 &&
				<div className={styles.header_login}>
					<a href={oauth_url}><span>osu!</span> login</a>
				</div>
			}
			{
				userInfo?.osu_id !== -1 &&
				<div className={styles.header_logged}>
					<div className={styles.header_username}>{userInfo?.username}{(userInfo?.user_stats?.wins !== -1) ? ` (${userInfo?.user_stats?.wins} wins)` : ''}</div>
					<div className={styles.header_profilepicture}><img src={userInfo?.profile_picture}/></div>
					<div className={styles.header_logout} onClick={logout}>Logout</div>
				</div>
			}
		</div>
	</>)
}
