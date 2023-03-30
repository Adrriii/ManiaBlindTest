import styles from '@/styles/modules/user.module.css';
import index_styles from '@/styles/modules/index.module.css';

import { getEmptyUserInfo, UserInfo } from '@/lib/types/user_info';
import { useEffect, useRef, useState } from 'react';
import { InitUserContext } from '@/lib/contexts/user_context';
import Score, { ScoreFull } from '@/lib/types/score';
import ScoreThumb from './score_thumb';

export default function User({ osu_id }: {osu_id: number}) {
	const [userInfo, setUserInfo] = useState<UserInfo | null>(getEmptyUserInfo());

	const [bestScores, setBestScores] = useState<ScoreFull[]>([]);
	const bPage = 0;
	const hasNextBest = true;
	const bestPage = useRef({bPage}).current;
	const nextBest = useRef({hasNextBest}).current;

	const [recentScores, setRecentScores] = useState<ScoreFull[]>([]);
	const rPage = 0;
	const hasNextRecent = true;
	const recentPage = useRef({rPage}).current;
	const nextRecent = useRef({hasNextRecent}).current;

	function addBestScores() {
		if(!userInfo  || userInfo.osu_id < 0) return;
		if(!nextBest.hasNextBest) return;

		bestPage.bPage++;

		fetch(`/api/user/${userInfo?.osu_id}/scores/best?page=${bestPage.bPage}`).then((data: Response) => {
			if(data.status !== 200 && data.status !== 207) return;
			if(data.status !== 207) nextBest.hasNextBest = false;

			data.json().then((scores: ScoreFull[]) => setBestScores([...bestScores, ...scores]))
		});
	}

	function addRecentScores() {
		if(!userInfo  || userInfo.osu_id < 0) return;
		if(!nextRecent.hasNextRecent) return;

		recentPage.rPage++;

		fetch(`/api/user/${userInfo?.osu_id}/scores/recent?page=${recentPage.rPage}`).then((data: Response) => {
			if(data.status !== 200 && data.status !== 207) return;
			if(data.status !== 207) nextRecent.hasNextRecent = false;

			data.json().then((scores: ScoreFull[]) => setRecentScores([...recentScores, ...scores]))
		});
	}

	useEffect(() => {
		if(osu_id !== undefined) {
			InitUserContext(setUserInfo, osu_id);
		}
	}, []);

	useEffect(() => {
		addBestScores();
		addRecentScores();
	}, [userInfo]);

	return (<>
		{
			userInfo !== null && (<>
			{
				userInfo.osu_id <= 0 &&
				<div className={index_styles.center_big}>
					Loading...
				</div>
			}
			<div className={styles.user_container}>
				{
					userInfo.osu_id > 0 &&
					<div className={styles.user_page}>
						<div className={styles.user_head}>{`${userInfo.username}'`}s profile</div>
						<div className={styles.user_bloc_info}>
							<img className={styles.user_picture} src={userInfo?.profile_picture}/>
							{
								userInfo.user_stats &&
								<div className={styles.user_stats}>
									<div className={styles.user_stats_wins}>{userInfo.user_stats.wins} wins</div>
									<div className={styles.user_stats_loss}>{userInfo.user_stats.losses} wrongs</div>
								</div>	
							}						
						</div>
						<div className={styles.user_bloc_bests}>
							<div className={styles.user_bloc_title}>Best scores</div>
							{
								bestScores && bestScores.map(score => {
									return <ScoreThumb
										score_full={score}
										mode='song'
										key={score.score.score_date}
									/>	
								})
							}
						</div>
						<div className={styles.user_bloc_recent}>
							<div className={styles.user_bloc_title}>Recent scores</div>
							{
								recentScores && recentScores.map(score => {
									return <ScoreThumb
										score_full={score}
										mode='song'
										key={score.score.score_date}
									/>	
								})
							}
						</div>
					</div>
				}
			</div>
			</>)
		}
	</>)
}
