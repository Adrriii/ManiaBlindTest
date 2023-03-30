import styles from '@/styles/modules/score.module.css';
import { useContext, useEffect, useRef, useState } from 'react';
import ScoreLib from '@/lib/types/score';
import { GameContext } from '@/lib/contexts/game_context';
import { ScoresResponse } from '../api/mapset/[hash_id]/scores';
import ScoreThumb from './score_thumb';
import { userInfo } from 'os';

export default function Score() {
	const {gameInfo, setGameInfo} = useContext(GameContext);
	const [score, setScore] = useState(ScoreLib.computeScore(gameInfo));
	const [scores, setScores] = useState<ScoresResponse | null>(null);
	const once = useRef(false);

	useEffect(() => {
		if(!gameInfo.over) {
			once.current = false;
			setScores(null);
		}
		if(gameInfo.over && gameInfo.answer) {
			if(once.current) return;
			once.current = true;

			fetch(`/api/mapset/${gameInfo.answer.hash_id}/scores`).then((data: Response) => {
				if(data.status !== 200) return;

				data.json().then((scores: ScoresResponse) => {
					setScores(scores);
				});
			});
		}
	}, [gameInfo]);

	useEffect(() => {
		const interval = setInterval(() => {
			if(gameInfo.start_time !== -1) {
				setScore(ScoreLib.computeScore(gameInfo));
			}
		}, 50);

		return () => clearInterval(interval);
	}, [gameInfo]);

	return (<>
		<div className={styles.score}>
			{
				gameInfo.id && (!gameInfo.over || (gameInfo.over && gameInfo.win)) &&
				<div className={styles.score_number}>
					Score: { score }
				</div>
			}
			{
				(gameInfo.end_time > 0 && gameInfo.win) &&
				<div className={styles.score_time}>
					in { ((gameInfo.end_time - gameInfo.start_time) / 1000).toFixed(2) } seconds
				</div>
			}
			{
				(scores && scores.own_score) &&
				<div className={styles.own_score}>
					<ScoreThumb 
						score_full={scores.own_score}
						mode={'user'}
					/>
				</div>
			}
			{
				scores &&
				<div className={styles.leaderboard}>
					{
						scores.scores.map(score_full =>
							<ScoreThumb 
								score_full={score_full}
								mode={'user'}
								hide_first={scores.own_score && scores.own_score.score.rank === 1}
							/>
						)
					}
				</div>
			}
		</div>
	</>)
}
