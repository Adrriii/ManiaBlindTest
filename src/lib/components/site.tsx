import styles from '@/styles/modules/index.module.css'

import SiteHead from './site_head';

import { UserInfo } from '@/lib/types/user_info';
import { ReactNode, useEffect, useState } from 'react';
import { InitUserContext, UserContext } from '@/lib/contexts/user_context';
import Header from './header';

export default function Site({ page }: { page: ReactNode }) {
	const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
	const userContext = {userInfo, setUserInfo};

	useEffect(() => {
		InitUserContext(setUserInfo);
	}, []);

	return (<>
		<SiteHead/>
		<UserContext.Provider value={userContext}>
			<main className={styles.main}>
				<Header/>
				{page}
			</main>
		</UserContext.Provider>
	</>)
}
