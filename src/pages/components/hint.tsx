import styles from '@/styles/modules/hint.module.css'
import { useContext } from 'react';
import { GameContext } from '../contexts/game_context';
import { GameInfo } from '../types/game_info';

export default function Hint() {
	const {gameInfo, setGameInfo} = useContext(GameContext);

	function nextHint(): void {
		fetch(`/api/next_hint/${gameInfo.id}`).then((data: Response) => {
			data.json().then((game: GameInfo) => {
				setGameInfo(game);
			});
		});
	}

	return (<>
		{ gameInfo.song_info?.uri && 
		<div className={styles.hint}>
			<div className={styles.next_hint}>
				<button onClick={nextHint}>Next hint</button>
			</div>
			<div className={styles.hint_banner}>{gameInfo.hints?.banner_url}</div>
			<div className={styles.hint_title}>{gameInfo.hints?.title}</div>
			<div className={styles.hint_artist}>{gameInfo.hints?.artist}</div>
		</div>
		}
	</>)
}
