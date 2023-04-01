import styles from '@/styles/modules/index.module.css'

import SiteHead from '../lib/components/site_head';

import { useEffect, useRef, useState } from 'react';
import { UserInfo } from '@/lib/types/user_info';

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
		<SiteHead/>
		<main className={styles.main}>
			<div className={styles.center_big}>
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
