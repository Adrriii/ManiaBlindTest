import styles from '@/styles/modules/leaderboards.module.css';
import { useCallback, useEffect, useRef, useState } from 'react';
import { UserStats } from '../db/user_stats';
import { UserInfo } from '../types/user_info';
import UserThumb from './user/user_thumb';

export default function Leaderboards() {
	const [users, setUsers] = useState<(UserInfo & UserStats)[]>([]);
	const lbPage = 1;
	const currentPage = useRef({lbPage}).current;

	const setPage = useCallback(() => {
		fetch(`/api/user/top?page=${currentPage.lbPage}`).then((data: Response) => {
			if(data.status !== 200) return;

			data.json().then(setUsers);
		});
	}, [currentPage.lbPage]);

	useEffect(() => {
		setPage();
	}, [setPage])

	return (<>
		<div className={styles.leaderboards_container}>
			<div className={styles.leaderboard_head}>
				<div className={styles.lb_rank}>Rank</div>
				<div className={styles.lb_name}>Player</div>
				<div className={styles.lb_wins}>Wins</div>
				<div className={styles.lb_losses}>Wrongs</div>
				<div className={styles.lb_grades_x}><img src={`/grades/X.png`} alt='X'/></div>
				<div className={styles.lb_grades_ss}><img src={`/grades/SS.png`} alt='SS'/></div>
				<div className={styles.lb_grades_s}><img src={`/grades/S.png`} alt='S'/></div>
			</div>
			<div className={styles.leaderboards}>
				{
					users.map((user, r) => {
						return <UserThumb
							key={user.osu_id}
							rank={r+1}
							userInfo={user}
							userStats={user}
						/>
					})
				}
			</div>
		</div>
	</>)
}
