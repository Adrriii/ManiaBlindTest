import styles from '@/styles/modules/hint.module.css'
import { useContext } from 'react';
import { GameContext } from '../../lib/contexts/game_context';
import { GameInfo } from '../../lib/types/game_info';

export default function Hint() {
	const {gameInfo, setGameInfo} = useContext(GameContext);

	const unknown_banner = '/unknown.png';

	function nextHint(): void {
		fetch(`/api/next_hint/${gameInfo.id}`).then((data: Response) => {
			data.json().then((game: GameInfo) => {
				setGameInfo(game);
			});
		});
	}

	function addClass(style: string): string {
		return `${styles.hint_div} ${style}`;
	}

	return (<>
		{ gameInfo.song_uri && 
		<div className={styles.hint}>
			{ !gameInfo.over &&
				<div className={styles.next_hint}>
					<button onClick={nextHint}>Next hint</button>
				</div>
			}
			<div className={styles.hint_map}>
				<div className={styles.hint_banner_container}>
					<div className={styles.hint_banner}>
						<img 
							className={gameInfo.hints?.banner_url ? '' : styles.unknown}
							src={gameInfo.hints?.banner_url ? gameInfo.hints.banner_url : unknown_banner}
						/>
					</div>
				</div>
				<div className={styles.hint_info_container}>
					<div className={addClass(styles.hint_mappers)}>
						<div className={styles.hint_label}>Mapped by :</div>
						<div className={styles.hint_info}>{gameInfo.hints?.mappers.join(', ')}</div>
					</div>
					<div className={addClass(styles.hint_ranked_dates)}>
						<div className={styles.hint_label}>Ranked date :</div>
						<div className={styles.hint_info}>{gameInfo.hints?.rank_dates.join(', ')}</div>
					</div>
					<div className={addClass(styles.hint_diffs)}>
						<div className={styles.hint_label}>Versions :</div>
						<div className={styles.hint_info}>{gameInfo.hints?.mapsets_diffs.reduce((list, map) => list.concat(map), []).join(', ')}</div>
					</div>
					<div className={addClass(styles.hint_artist)}>
						<div className={styles.hint_label}>Artist :</div>
						<div className={styles.hint_info}>{gameInfo.hints?.artist}</div>
					</div>
					<div className={addClass(styles.hint_title)}>
						<div className={styles.hint_label}>Title :</div>
						<div className={styles.hint_info}>{gameInfo.hints?.title}</div>
					</div>
				</div>
			</div>
		</div>
		}
	</>)
}
