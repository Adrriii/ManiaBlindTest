import style from '@/styles/modules/propositions.module.css';

import { GameContext } from '@/lib/contexts/game_context';
import { Song } from '@/lib/db/song';
import { SearchResults } from '@/lib/types/search_results';
import { SyntheticEvent, useContext } from 'react';

type PropositionsProps = {
	search_type: keyof SearchResults
	results: Song[],
	focused: Song | null
}

export default function Propositions({ search_type, results, focused }: PropositionsProps) {
	const {gameInfo, setGameInfo} = useContext(GameContext);

	function getSearchTypeLabel(search_type: keyof SearchResults): string {
		switch(search_type) {
			case 'artists':
				return 'Artist results';
			case 'titles':
				return 'Song results';
		}
	}

	function getSongText(mapset: Song) {
		return `${mapset.artist} - ${mapset.title}`;
	}

	function choseGuess(evt: SyntheticEvent) {
		const option = (evt.target as HTMLDivElement);

		const newGameInfo = {...gameInfo};
		newGameInfo.guess_song = option.textContent as string;
		newGameInfo.guess_mapset = parseInt(option.attributes.getNamedItem('value-mapset')?.value as string);

		setGameInfo(newGameInfo);
	}

	return (<>
		<div className={style.propositions}>
			<div className={style.propositions_header}>{getSearchTypeLabel(search_type)}</div>
			{
				results && results.map(result => {
					return <div 
						key={result.beatmapset_id} 
						className={`${style.propositions_option}${result.hash_id === focused?.hash_id ? ` ${style.focused}` : ''}`}
						title={getSongText(result)}
						onClick={choseGuess}
						value-mapset={result.beatmapset_id}
						>
							{getSongText(result)}
						</div>
				})
			}
		</div>
	</>)
}
