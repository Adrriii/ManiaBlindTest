import styles from '@/styles/modules/play_random.module.css'
import { useContext, useEffect, useState } from 'react';
import { GameContext } from '../../lib/contexts/game_context';
import { GameInfo, getEmptyGameInfo } from '../../lib/types/game_info';

export default function PlayRandom() {
	const {gameInfo, setGameInfo} = useContext(GameContext);
	const [volume, setVolume] = useState(0.5);
	const [isPlaying, setIsPlaying] = useState(false);
	const [isPaused, setIsPaused] = useState(false);
	const [givingUp, setGiveUp] = useState(false);

	useEffect(() => {
		if(gameInfo.id && getPlayer().src !== gameInfo.song_uri) {
			getPlayer().src = gameInfo.song_uri;
			getPlayer().play();
			setIsPlaying(true);
			setIsPaused(false);
		}
	}, [gameInfo])

	function getPlayer(): HTMLAudioElement {
		return document.getElementById('player') as HTMLAudioElement;
	}
	
	function playRandom() {
		fetch('/api/next_song').then((data: Response) => {
			data.json().then((game: GameInfo) => {
				setGameInfo(game);
			});
		});
	}
	
	function pause() {
		getPlayer().pause();
		setIsPaused(true);
	}
	
	function resume() {
		getPlayer().play();
		setIsPaused(false);
	}

	function handleEnded() {
		getPlayer().src = '';
		setIsPlaying(false);
	}

	useEffect(() => {
		fetch(`/api/next_hint/${gameInfo.id}`).then((data: Response) => {
			data.json().then((game: any) => {
				if(game.error) {
					return;
				}
				setGameInfo(game as GameInfo);

				if(!game.over) {
					setGiveUp(!givingUp);
				}
			});
		});
	}, [givingUp]);

	async function giveUp() {
		setGiveUp(!givingUp);
	}

	function next() {
		pause();
		playRandom();
	}

	function handleVolumeChange(volume: number) {
		setVolume(volume);
		getPlayer().volume = volume;
	}

	return (<>
		<div className={styles.play_random}>
			<audio id='player' onEnded={handleEnded}></audio>
			{ !isPlaying && <button onClick={playRandom}>Play</button>}
			{ !isPaused && isPlaying && <button onClick={pause}>Pause</button>}
			{ isPaused && isPlaying && <button onClick={resume}>Resume</button>}
			{ isPlaying && gameInfo.over && <button onClick={next}>Next !</button>}
			{ isPlaying && !gameInfo.over && <button onClick={giveUp}>Give Up</button>}
			
			<input
				type="range"
				min={0}
				max={1}
				step={0.02}
				value={volume}
				onChange={event => {
					handleVolumeChange(event.target.valueAsNumber)
				}}
			/>
		</div>
	</>)
}
