import style from '@/styles/modules/guess.module.css';

import Propositions from './propositions';

import { GameContext } from '@/lib/contexts/game_context';
import { Song } from '@/lib/db/song';
import { getEmptySearchResults, SearchResults } from '@/lib/types/search_results';
import { useCallback, useContext, useEffect, useRef, useState } from 'react';

export default function Guess() {
	const {gameInfo, setGameInfo} = useContext(GameContext);
	const gameInfoRef = useRef({gameInfo});

	const [propositions, setPropositions] = useState<SearchResults>(getEmptySearchResults());
	const search_id = 'guess_search_input';	

	const [focusedProposition, setFocusedProposition] = useState<Song | null>(null);
	const focusedRef = useRef({focusedProposition});
	const [pressed, setPressed] = useState<{[keys: string]: boolean}>({});
	const guessButtonId = 'guess_button';

	function getSearch(): HTMLInputElement {
		return document.getElementById(search_id) as HTMLInputElement;
	}

	const focusText = useCallback(() => {
		getSearch().select();
		setPropositions(getEmptySearchResults());
	}, []);

	const updateSearch = useCallback(() => {
		const newGameInfo = {...gameInfo};
		newGameInfo.guess_song = '';
		newGameInfo.guess_mapset = -1;

		setGameInfo(newGameInfo);
		setFocusedProposition(null); 

		const search = getSearch().value;
		if(!search) {
			setPropositions(getEmptySearchResults());
			return;
		}

		const opts: RequestInit = {
			method: 'POST',
			headers: { 'Content-type': 'application/json' },
			body: JSON.stringify(search)
		}
		fetch('/api/search_song', opts).then((data: Response) => {
			data.json().then((results: SearchResults) => {
				setPropositions(results);
			});
		});
	}, [gameInfo, setGameInfo]);

	const moveSelection = useCallback((direction: 'up' | 'down') => {
		const list = [...propositions.titles, ...propositions.artists];
		if(list.length === 0) return;

		const focused = focusedRef.current.focusedProposition;
		const step = direction === 'down' ? 1 : -1;
		const index = focused ? list.findIndex(s => s.hash_id === focused.hash_id) : -1;

		if(index === -1) {
			setFocusedProposition(list[direction === 'down' ? 0 : list.length - 1]);
			return;
		}

		setFocusedProposition(list[(index + step + list.length) % list.length]);
	}, [propositions]);

	const moveSelectionUp = useCallback(() => moveSelection('up'), [moveSelection]);
	const moveSelectionDown = useCallback(() => moveSelection('down'), [moveSelection]);


	function getSongText(mapset: Song) {
		return `${mapset.artist} - ${mapset.title}`;
	}

	useEffect(() => {
		focusedRef.current.focusedProposition = focusedProposition;
	}, [focusedProposition]);

	useEffect(() => {
		const focused = focusedRef.current.focusedProposition;
		const game = gameInfoRef.current.gameInfo;
		
		if(pressed['Enter'] && game.guess_mapset > 0) {
			document.getElementById(guessButtonId)?.click();
			return;
		}
		if(pressed['Enter'] && focused !== null) {
			const ngame = {...game};
			ngame.guess_mapset = focused.beatmapset_id;
			ngame.guess_song = getSongText(focused);
			
			setGameInfo(ngame);
		}
	}, [pressed, setGameInfo]);

	useEffect(() => {
		if(pressed['ArrowUp']) {
			moveSelectionUp();
		}
		if(pressed['ArrowDown']) {
			moveSelectionDown();
		}
	}, [moveSelectionDown, moveSelectionUp, pressed]);

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
		if(gameInfo.guess_song && gameInfo.guess_song !== getSearch().value) {
			getSearch().value = gameInfo.guess_song;
			focusText();
		}
	}, [focusText, gameInfo])

	return (<>
		<div className={style.guess}>
			<div className={style.propositions_list}>
				{
					propositions.titles.length > 0 &&
					<Propositions search_type={'titles'} results={propositions.titles} focused={focusedProposition}></Propositions>
				}
				{
					propositions.artists.length > 0 &&
					<Propositions search_type={'artists'} results={propositions.artists} focused={focusedProposition}></Propositions>
				}
			</div>
			<input 
				placeholder='Search for a title, an artist...'
				id={search_id} type='text'
				autoComplete="off"
				value-mapset={gameInfo.guess_mapset}
				onChange={updateSearch}
				onClick={focusText}>
			</input>
		</div>
	</>)
}
