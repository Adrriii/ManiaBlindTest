import styles from '@/styles/modules/hint.module.css'
import btn_style from '@/styles/modules/button.module.css'
import moment from 'moment';
import { useContext, useEffect, useRef, useState } from 'react';
import { GameContext } from '../../lib/contexts/game_context';
import { GameInfo } from '../../lib/types/game_info';
import Button from './button';
import IconText from './icon_text';
import Guess from './guess';
import GuessButton from './guess_button';

export default function Hint() {
	const {gameInfo, setGameInfo} = useContext(GameContext);
	const [currentTime, setCurrentTime] = useState<number>(0);
	const [duration, setDuration] = useState<number>(0);
	const [progressRefresher, setProgressRefresher] = useState<NodeJS.Timer | null>(null);
	const prevRefresher = useRef({progressRefresher}).current;

	const unknown_banner = '/unknown.png';

	function getPlayer(): HTMLAudioElement {
		return document.getElementById('player') as HTMLAudioElement;
	}

	function getProgressBar(): HTMLDivElement {
		return document.getElementById('progress_bar') as HTMLDivElement;
	}

	function displayDate(date: string): string {
		return moment(date).format('DD MMMM YYYY');
	}

	function displaySeconds(secs: number): string {
		const minutes = Math.floor(secs / 60);
		const seconds = secs % 60;

		let min = minutes.toString();
		let sec = seconds.toString();
		if(min.length === 1) min = '0' + min;
		if(sec.length === 1) sec = '0' + sec;

		return `${min}:${sec}`;
	}

	// Update song progress bar
	useEffect(() => {
		if(!gameInfo.song_length) return;
		setProgressRefresher(
			setInterval(() => {
				if(!document) return;
		
				const player = getPlayer();
				const bar = getProgressBar();
				const total_length = player.duration;
				
				setDuration(total_length);
				
				if(!player || !bar) return;
				if(!player.currentTime) bar.style.width = "0%";
				if(player.currentTime) bar.style.width = `${player.currentTime / total_length * 100}%`;
				setCurrentTime(Math.floor(player.currentTime));
			}, 150)
		);
	}, [gameInfo]);

	useEffect(() => {
		if(prevRefresher.progressRefresher) {
			clearInterval(prevRefresher.progressRefresher);
		}

		return () => {
			prevRefresher.progressRefresher = progressRefresher
		}
	}, [progressRefresher])

	function nextHint(): void {
		if(!gameInfo.id) return;

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
			<div className={styles.hint_map}>
				<div className={styles.hint_banner_container}>
					<div className={styles.hint_banner}>
						<img 
							className={gameInfo.hints?.banner_url ? '' : styles.unknown}
							src={gameInfo.hints?.banner_url ? gameInfo.hints.banner_url : unknown_banner}
						/>
					</div>
					<div className={styles.progress_bar}>
						<div className={styles.progress_bar_bg}></div>
						<div id='progress_bar' className={styles.progress_bar_fill}></div>
						<div className={styles.progress_bar_start}>{displaySeconds(currentTime)}</div>
						<div className={styles.progress_bar_end}>{displaySeconds(Math.floor(getPlayer().duration))}</div>
					</div>
				</div>
				<div className={styles.hint_info_container}>
					<div className={addClass(styles.hint_ranked_dates)}>
						<div className={styles.hint_label}>Ranked date :</div>
						<div className={styles.hint_info}>{gameInfo.hints?.rank_dates.length > 0 ? gameInfo.hints?.rank_dates.map((d) => displayDate(d)).join(', ') : '???'}</div>
					</div>
					<div className={addClass(styles.hint_mappers)}>
						<div className={styles.hint_label}>Mapped by :</div>
						<div className={styles.hint_info}>{gameInfo.hints?.mappers.length > 0 ? gameInfo.hints?.mappers.join(', ') : '???'}</div>
					</div>
					<div className={addClass(styles.hint_diffs)}>
						<div className={styles.hint_label}>Versions :</div>
						<div className={styles.hint_info}>{gameInfo.hints?.mapsets_diffs.length > 0 ? gameInfo.hints?.mapsets_diffs.reduce((list, map) => list.concat(map), []).join(', ') : '???'}</div>
					</div>
					<div className={addClass(styles.hint_artist)}>
						<div className={styles.hint_label}>Artist :</div>
						<div className={styles.hint_info}>{gameInfo.hints?.artist ? gameInfo.hints?.artist : '???'}</div>
					</div>
					<div className={addClass(styles.hint_title)}>
						<div className={styles.hint_label}>Title :</div>
						<div className={styles.hint_info}>{gameInfo.hints?.title ? gameInfo.hints?.title : '???'}</div>
					</div>
				</div>
			</div>
			{ !gameInfo.over &&
				<Guess/>
			}
			<div className={styles.action_buttons}>
				{ (!gameInfo.over) &&
					<Button 
						button={
							<button onClick={nextHint} disabled={gameInfo.hints_used > 4}>
								<IconText icon={'help'} text={'Hint'}></IconText>
							</button>
						}
						styles={[styles.next_hint]}
					></Button>
				}
				{ !gameInfo.over &&
					<GuessButton/>
				}
			</div>
		</div>
		}
	</>)
}
