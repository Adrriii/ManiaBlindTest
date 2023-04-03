import styles from '@/styles/modules/header.module.css';

import { removeCookies } from 'cookies-next';
import { useContext } from 'react';

import { UserContext } from '@/lib/contexts/user_context';

export default function Header() {
	const {userInfo, } = useContext(UserContext);
	const client_id = process.env.NEXT_PUBLIC_OSU_CLIENT_ID;
	const client_url = process.env.NEXT_PUBLIC_SITE_URL;
	const oauth_url = `https://osu.ppy.sh/oauth/authorize?response_type=code&client_id=${client_id}&scope=identify%20public&redirect_uri=${client_url}/oauth`;
	
	function logout() {
		removeCookies(process.env.NEXT_PUBLIC_AUTH_COOKIE as string);
		window.location.reload();
	}

	function goToProfile() {
		window.location.href = `/user/${userInfo?.osu_id}`;
	}

	function goToLbs() {
		window.location.href = `/leaderboards`;
	}

	function goToAbout() {
		window.location.href = `/about`;
	}

	function goToGame() {
		window.location.href = `/`;
	}

	return (<>
		<div className={styles.header}>
			<div className={styles.header_logo} onClick={goToGame}>
				osu!mania blind test
			</div>
			<div className={styles.header_nav}>
				<div className={styles.header_always}>
					<div className={`${styles.header_about} ${styles.clickable}`} onClick={goToAbout}>About</div>
					<div className={`${styles.header_lbs} ${styles.clickable}`} onClick={goToLbs}>Leaderboards</div>
				</div>
				{
					userInfo?.osu_id === -1 &&
					<div className={`${styles.header_login} ${styles.clickable}`}>
						<a href={oauth_url}><span>osu!</span> login</a>
					</div>
				}
				{
					userInfo?.osu_id !== -1 &&
					<div className={styles.header_logged}>
						<div className={`${styles.header_username} ${styles.clickable}`} onClick={goToProfile}>{userInfo?.username}{(userInfo?.user_stats?.wins !== -1) ? ` (${userInfo?.user_stats?.wins} wins)` : ''}</div>
						<div className={`${styles.header_profilepicture} ${styles.clickable}`} onClick={goToProfile}><img alt='profile picture' src={userInfo?.profile_picture}/></div>
						<div className={`${styles.header_logout} ${styles.clickable}`} onClick={logout}>Logout</div>
					</div>
				}
			</div>
		</div>
	</>)
}
