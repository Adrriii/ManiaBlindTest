import Head from 'next/head'
import styles from '@/styles/modules/index.module.css'

import Header from './components/header';
import { useEffect, useRef, useState } from 'react';
import { getEmptyUserInfo, UserInfo } from '@/lib/types/user_info';

export default function Oauth() {
	const once = useRef(false);
	const [userInfo, setUserInfo] = useState<UserInfo | null>(null);

	useEffect(() => {
		if(once.current) return;
		once.current = true;

		const params = window.location.search.slice(1).split('=');
		if(params.length !== 2 || params[0] !== 'code') return;

		fetch(`/api/oauth/${params[1]}`).then((data: Response) => {
			data.json().then((user: UserInfo) => {
				setUserInfo(user);
				setTimeout(() => {
					window.location.href = process.env.NEXT_PUBLIC_SITE_URL as string;
				}, 2000);
			});
		});
	}, [])

	return (<>
		<Head>
			<title>osu!mania Blind Test</title>
			<meta name="description" content="Are you ready ?" />
			<meta name="viewport" content="width=device-width, initial-scale=1" />
			<link rel="icon" href="/favicon.png" />
		</Head>
		<main className={styles.main}>
			<Header/>
			<div className={styles.authent}>
				{
					userInfo &&
					<div className={styles.authenticated}>
						Hi {userInfo.username} !
					</div>
				}
				{
					!userInfo &&
					<div className={styles.authenticating}>
						Authenticating...
					</div>
				}
			</div>
		</main>
	</>)
}
