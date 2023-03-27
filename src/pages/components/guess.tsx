import { GameContext } from '@/lib/contexts/game_context';
import { Mapset } from '@/lib/db/beatmap';
import { getEmptySearchResults, SearchResults } from '@/lib/types/search_results';
import style from '@/styles/modules/guess.module.css';
import { ReactNode, useContext, useEffect, useState } from 'react';
import Propositions from './propositions';

export default function Guess() {
	const {gameInfo, setGameInfo} = useContext(GameContext);
	const [propositions, setPropositions] = useState<SearchResults>(getEmptySearchResults());
	const search_id = 'guess_search_input';

	function getSearch(): HTMLInputElement {
		return document.getElementById(search_id) as HTMLInputElement;
	}

	function focusText() {
		getSearch().select();
		setPropositions(getEmptySearchResults());
	}

	function updateSearch() {
		const newGameInfo = {...gameInfo};
		newGameInfo.guess_song = '';
		newGameInfo.guess_mapset = -1;

		setGameInfo(newGameInfo);

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
	}

	useEffect(() => {
		if(gameInfo.guess_song && gameInfo.guess_song !== getSearch().value) {
			getSearch().value = gameInfo.guess_song;
			focusText();
		}
	}, [gameInfo])

	return (<>
		<div className={style.guess}>
			<div className={style.propositions_list}>
				{
					propositions.artists.length > 0 &&
					<Propositions search_type={'artists'} results={propositions.artists}></Propositions>
				}
				{
					propositions.titles.length > 0 &&
					<Propositions search_type={'titles'} results={propositions.titles}></Propositions>
				}
			</div>
			<input 
				placeholder='Search for a title, an artist...'
				id={search_id} type='text'
				value-mapset={gameInfo.guess_mapset}
				onChange={updateSearch}
				onClick={focusText}>
			</input>
		</div>
	</>)
}
