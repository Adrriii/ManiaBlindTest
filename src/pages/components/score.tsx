import { GameInfo, getEmptyGameInfo } from '@/lib/types/game_info';
import styles from '@/styles/modules/score.module.css';
import { ReactNode, useContext, useEffect, useState } from 'react';
import ScoreLib from '@/lib/types/score';
import { GameContext } from '@/lib/contexts/game_context';

export default function Score() {
	const {gameInfo, setGameInfo} = useContext(GameContext);
	const [score, setScore] = useState(ScoreLib.computeScore(gameInfo));

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
				gameInfo.id &&
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
		</div>
	</>)
}
