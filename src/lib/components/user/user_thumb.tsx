import styles from '@/styles/modules/leaderboards.module.css';

import { UserStats } from '@/lib/db/user_stats';
import { UserInfo } from '@/lib/types/user_info';

type UserThumbProps = {
	userInfo: UserInfo,
	userStats: UserStats,
	rank?: number
};
export default function UserThumb({ userInfo, userStats, rank }: UserThumbProps) {

	function goToUser(osu_id: number) {
		window.location.href = `/user/${osu_id}`;
	}

	return (<>
		{
			userInfo &&
			<div className={styles.user_thumb}>
				{ rank && <div className={styles.user_rank}>{`#${rank}`}</div> }
				<div className={styles.user}>
					<img
						alt={userInfo.username}
						src={userInfo.profile_picture}
					/>
					<div className={styles.user_name} onClick={() => goToUser(userInfo.osu_id)}>{userInfo.username}</div>
				</div>
				<div className={styles.user_wins}>{userStats.wins}</div>
				<div className={styles.user_losses}>{userStats.losses}</div>
				<div className={styles.user_grades_x}>{userStats.grades_X}</div>
				<div className={styles.user_grades_ss}>{userStats.grades_SS}</div>
				<div className={styles.user_grades_s}>{userStats.grades_S}</div>
			</div>
	}
	</>)
}
