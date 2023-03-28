import Head from 'next/head'
import styles from '@/styles/modules/index.module.css'

import Header from './components/header';
import Game from './components/game';
import { getEmptyUserInfo, UserInfo } from '@/lib/types/user_info';
import { useEffect, useState } from 'react';
import { UserContext } from '@/lib/contexts/user_context';
import { getCookie } from 'cookies-next';
import { getEmptyUserStats, UserStats } from '@/lib/db/user_stats';

export default function Home() {
	const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
	const userContext = {userInfo, setUserInfo};

	useEffect(() => {
		fetch(`/api/login/`).then((data: Response) => {
			if(data.status !== 200) {
				setUserInfo(getEmptyUserInfo());
				return;
			}

			data.json().then((userInfo: UserInfo) => {
				if(userInfo.osu_id !== -1) {
					fetch(`/api/user/${userInfo.osu_id}/stats`).then((data: Response) => {
						if(data.status !== 200) {
							userInfo.user_stats = getEmptyUserStats();
							setUserInfo(userInfo);
							return;
						}
						data.json().then((stats: UserStats) => {
							userInfo.user_stats = stats;
							setUserInfo(userInfo);
						});
					});
				} else {
					setUserInfo(userInfo);
				}
			});
		});
	}, []);

	return (<>
		<Head>
			<title>osu!mania Blind Test</title>
			<meta name="description" content="Are you ready ?" />
			<meta name="viewport" content="width=device-width, initial-scale=1" />
			<link rel="icon" href="/favicon.png" />
		</Head>
		<main className={styles.main}>
			<UserContext.Provider value={userContext}>
				<Header/>
				<Game/>
			</UserContext.Provider>
		</main>
	</>)
}
