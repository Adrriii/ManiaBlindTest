import { GameContext } from '@/lib/contexts/game_context';
import { GameInfo } from '@/lib/types/game_info';
import styles from '@/styles/modules/hint.module.css';
import { ReactNode, useContext, useEffect, useState } from 'react';
import Button from './button';
import IconText from './icon_text';

export default function GuessButton() {
	const {gameInfo, setGameInfo} = useContext(GameContext);
	const [buttonState, setButtonState] = useState<'neutral' | 'win' | 'lose'>('neutral');

	function makeGuess() {
		if(gameInfo.guess_mapset) {
			const opts: RequestInit = {
				method: 'POST',
				headers: { 'Content-type': 'application/json' },
				body: JSON.stringify(gameInfo)
			}
			fetch('/api/make_guess', opts).then((data: Response) => {
				data.json().then((game: GameInfo) => {
					setGameInfo(game);
				});
			});
		}
	}

	useEffect(() => {
		if(gameInfo.over) {
			if(gameInfo.win) {
				setButtonState('win');
			} else {
				setButtonState('lose');
			}
		}
	}, [gameInfo]);

	return (<>
		<Button
			button={
				<button
					onClick={makeGuess}
					disabled={!gameInfo.guess_mapset || gameInfo.guess_mapset < 0}
				>
					<IconText icon={'done'} text={'Guess'}></IconText>
				</button>
			}
			styles={[styles.guess_button_valid, buttonState]}
		/>
	</>)
}
