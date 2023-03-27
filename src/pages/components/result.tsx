import { GameContext } from '@/lib/contexts/game_context';
import styles from '@/styles/modules/result.module.css';
import { useContext } from 'react';

export default function Result() {
	const {gameInfo, setGameInfo} = useContext(GameContext);

	return (<>
		<div className={styles.result}>
			{
				gameInfo.over &&
				(
					gameInfo.win ?
					<div className={styles.win}>Congratulations !</div> :
					(
						gameInfo.guesses_used > 0 ?
						(
							<>
								<div className={styles.lose}>Wrong !</div>
								<div className={styles.lose_guess}>You guessed <span className={styles.guess_title}>{gameInfo.guess_song}</span></div>
							</>
						) :
						<div className={styles.lose}></div>
					)
				)
			}
		</div>
	</>)
}
