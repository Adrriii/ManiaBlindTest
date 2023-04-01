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

	const tryMoveSelection = useCallback((selection: Song[], direction: 'up' | 'down', next_selections: Song[][]): boolean => {
		if(selection.length === 0) return tryMoveSelection(next_selections[0], direction, next_selections.slice(1, next_selections.length));
		
		if(focusedRef.current.focusedProposition === null) {
			const next = selection[direction === 'down' ? 0 : (selection.length - 1)];
			if(next) {
				setFocusedProposition(next);
				return true;
			}

			if(next_selections.length === 0) return false;
			return tryMoveSelection(next_selections[0], direction, next_selections.slice(1, next_selections.length));
		}
		
		for(
			let i = (direction === 'down' ? 0 : (selection.length - 1));
			(direction === 'down' ? i < selection.length : i >= 0);
			(direction === 'down' ? i++ : i--)
		) {
			if(selection[i].hash_id === focusedRef.current.focusedProposition.hash_id) {
				const test = selection[(direction === 'down' ? i+1 : i-1)];
				if(test === undefined) {
					if(next_selections.length === 0) return false;
					const next = next_selections[0];
					if(next.length === 0) return false;
					setFocusedProposition(next[(direction === 'down' ? 0 : next.length - 1)]);
					return true;
				}
				setFocusedProposition(test);
				return true;
			}
		}

		if(next_selections.length === 0) return false;
		return tryMoveSelection(next_selections[0], direction, next_selections.slice(1, next_selections.length));
	}, []);

	const moveSelectionUp = useCallback(() => {
		if(propositions.artists.length === 0 && propositions.titles.length === 0) return;
		
		tryMoveSelection(propositions.titles, 'up', [propositions.artists]);
	}, [propositions, tryMoveSelection]);

	const moveSelectionDown = useCallback(() => {
		if(propositions.artists.length === 0 && propositions.titles.length === 0) return;
		
		tryMoveSelection(propositions.artists, 'down', [propositions.titles]);
	}, [propositions, tryMoveSelection]);
	

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
					propositions.artists.length > 0 &&
					<Propositions search_type={'artists'} results={propositions.artists} focused={focusedProposition}></Propositions>
				}
				{
					propositions.titles.length > 0 &&
					<Propositions search_type={'titles'} results={propositions.titles} focused={focusedProposition}></Propositions>
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
