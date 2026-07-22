import styles from '@/styles/modules/play_random.module.css';

import { RequestInit } from 'next/dist/server/web/spec-extension/request';
import { useCallback, useContext, useEffect, useRef, useState } from 'react';

import { FiltersContext } from '@/lib/contexts/filters_context';
import { GameContext } from '../../contexts/game_context';
import { NextSongParams, SongFilters, getEmptySongFilters } from '@/lib/types/next_song_params';
import { GameInfo } from '../../types/game_info';

import Button from '../ui/button';
import Filters from './filters';
import IconText from '../ui/icon_text';
import GuessButton from './guess_button';
import hint_styles from '@/styles/modules/hint.module.css';
import btn_styles from '@/styles/modules/button.module.css';
import { ApiError } from 'next/dist/server/api-utils';
import Welcome from '../welcome';
import { UserContext } from '@/lib/contexts/user_context';

function volumeIcon(volume: number): string {
	if(volume === 0) return 'volume_off';
	if(volume < 0.5) return 'volume_down';

	return 'volume_up';
}

export default function PlayRandom() {
	const {userInfo, } = useContext(UserContext);
	const {gameInfo, setGameInfo} = useContext(GameContext);
	const gameInfoRef = useRef({gameInfo});
	const [volume, setVolume] = useState(0.5);
	const [preMuteVolume, setPreMuteVolume] = useState(0.5);
	const [isPlaying, setIsPlaying] = useState(false);
	const isPlayingRef = useRef({isPlaying});
	const [isPaused, setIsPaused] = useState(false);
	const [givingUp, setGiveUp] = useState(false);
	const givingUpRef = useRef({givingUp});
	const [givenUp, setGivenUp] = useState(false);
	
	const [songFilters, setSongFilters] = useState<SongFilters>(getEmptySongFilters());
	const filtersContext = {songFilters, setSongFilters};
	
	const search_id = 'guess_search_input';

	useEffect(() => {
		const uservolume = localStorage.getItem("volume");
		if(uservolume !== null) {
			handleVolumeChange(parseFloat(uservolume));
		}
	}, []);

	function getSearch(): HTMLInputElement | null {
		return document.getElementById(search_id) as HTMLInputElement | null;
	}

	const [pressed, setPressed] = useState<{[keys: string]: boolean}>({});

	const handleKeyPress = useCallback((event: { key:  string; }) => {
		setPressed(pressed => ({
			...pressed,
			[event.key]: true
		}));
	}, []);	
	const handleKeyUp = useCallback((event: { key: string; }) => {
		setPressed(pressed => ({
			...pressed,
			[event.key]: false
		}));
	}, []);

	useEffect(() => {
		document.addEventListener('keydown', handleKeyPress);
		document.addEventListener('keyup', handleKeyUp);
	
		return () => {
			document.removeEventListener('keydown', handleKeyPress);
			document.removeEventListener('keyup', handleKeyUp);
		};
	}, [handleKeyPress, handleKeyUp]);

	useEffect(() => {
		gameInfoRef.current.gameInfo = gameInfo;
		if(gameInfo.id && getPlayer().src !== gameInfo.song_uri) {
			getPlayer().src = gameInfo.song_uri;
			getPlayer().play();
			setIsPlaying(true);
			setIsPaused(false);
			getSearch()?.focus();
		}
	}, [gameInfo])

	function getPlayer(): HTMLAudioElement {
		return document.getElementById('player') as HTMLAudioElement;
	}
	
	const playRandom = useCallback(() => {
		const params: NextSongParams = {
			filters: songFilters
		}
		const opts: RequestInit = {
			method: 'POST',
			headers: { 'Content-type': 'application/json' },
			body: JSON.stringify(params)
		}
		fetch('/api/next_song', opts).then((data: Response) => {
			data.json().then((game: GameInfo) => {
				setGameInfo(game);
				setGivenUp(false);
			});
		});
	}, [setGameInfo, songFilters]);
	
	const pause = useCallback(() => {
		getPlayer().pause();
		setIsPaused(true);
	}, []);
	
	function resume() {
		getPlayer().play();
		setIsPaused(false);
	}

	function handleEnded() {
		setIsPaused(true);
	}

	useEffect(() => {
		givingUpRef.current.givingUp = givingUp;

		if(!gameInfoRef.current.gameInfo.id) return;
		fetch(`/api/next_hint/${gameInfoRef.current.gameInfo.id}`).then((data: Response) => {
			data.json().then((game: GameInfo | ApiError) => {
				if(game instanceof ApiError) {
					return;
				}
				setGameInfo(game as GameInfo);

				if(!game.over) {
					setGiveUp(!givingUp);
				}
			});
		});
	}, [givingUp, setGameInfo]);

	const giveUp = useCallback(() => {
		setGivenUp(true);
		setGiveUp(!givingUpRef.current.givingUp);
	}, []);

	const next = useCallback(() => {
		pause();
		playRandom();
	}, [pause, playRandom]);

	function nextHint(): void {
		if(!gameInfo.id) return;

		fetch(`/api/next_hint/${gameInfo.id}`).then((data: Response) => {
			data.json().then((game: GameInfo) => {
				setGameInfo(game);
			});
		});
	}

	function handleVolumeChange(volume: number) {
		localStorage.setItem("volume", volume.toString());
		setVolume(volume);
		getPlayer().volume = volume;
	}

	function toggleMute() {
		if(volume > 0) {
			setPreMuteVolume(volume);
			handleVolumeChange(0);
			return;
		}

		handleVolumeChange(preMuteVolume > 0 ? preMuteVolume : 0.5);
	}

	useEffect(() => {
		isPlayingRef.current.isPlaying = isPlaying;
	}, [isPlaying]);

	useEffect(() => {
		if(isPlayingRef.current.isPlaying && pressed['Alt'] && pressed['*']) {
			if(gameInfoRef.current.gameInfo.over) {
				next();
			} else {
				giveUp();
			}
		}
	}, [pressed, giveUp, next]);

	return (<>
		<div className={styles.play_random}>
			<audio id='player' onEnded={handleEnded}></audio>
			{ !isPlaying &&
				<div className={styles.play_container}>
					<Welcome/>
					<Button
						button={
							<button onClick={playRandom}>
								<IconText icon={'play_arrow'} text={'Play'}></IconText>
							</button>
						}
						styles={[btn_styles.button_lg]}
					></Button>
				</div>
			}
			<div className={styles.buttons}>
				{ !isPaused && isPlaying &&
					<Button button={
						<button onClick={pause}>
							<IconText icon={'pause'} text={'Pause'}></IconText>
						</button>
					}></Button>
				}
				{ isPaused && isPlaying &&
					<Button button={
						<button onClick={resume}>
							<IconText icon={'resume'} text={'Resume'}></IconText>
						</button>
					}></Button>
				}
				{ isPlaying && !gameInfo.over &&
					<Button
						button={
							<button onClick={nextHint} disabled={gameInfo.hints_used > 4}>
								<IconText icon={'help'} text={'Hint'}></IconText>
							</button>
						}
						styles={[hint_styles.next_hint]}
					></Button>
				}
				{ isPlaying && !gameInfo.over && <GuessButton/> }
				{ isPlaying && gameInfo.over &&
					<Button button={
						<button onClick={next}>
							<IconText icon={'skip_next'} text={'Next'}></IconText>
						</button>
					}></Button>
				}
				{ isPlaying && !gameInfo.over &&
					<Button button={
						<button onClick={giveUp} disabled={givenUp}>
							<IconText icon={'stop'} text={'Give Up'}></IconText>
						</button>
					}></Button>
				}
			</div>
			
			<div className={styles.volume_controller}>
				<div className={styles.volume_head}>
					<span
						className={`material-symbols-outlined ${styles.volume_icon}`}
						onClick={toggleMute}
						title={volume === 0 ? 'Unmute' : 'Mute'}
					>{volumeIcon(volume)}</span>
					<span className={styles.volume_label}>Volume</span>
					<span className={styles.volume_value}>{Math.round(volume * 100)}%</span>
				</div>
				<input
					className={styles.volume_slider}
					type="range"
					min={0}
					max={1}
					step={0.02}
					value={volume}
					aria-label="Sound volume"
					title="Sound volume"
					onChange={event => {
						handleVolumeChange(event.target.valueAsNumber)
					}}
				/>
				<div className={styles.keybinds}>
					<div><div>Give Up / Next</div>	<div> <code>Alt</code> + <code>*</code></div></div>
					<div><div>Selection</div>		<div> <code>Up</code> / <code>Down</code></div></div>
					<div><div>Select / Guess</div>	<div> <code>Enter</code></div></div>
				</div>
			</div>

			<FiltersContext.Provider value={filtersContext}>
				<Filters/>
			</FiltersContext.Provider>
		</div>
	</>)
}
