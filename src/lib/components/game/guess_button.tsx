import styles from '@/styles/modules/hint.module.css';

import { useContext, useState } from 'react';

import { GameContext } from '@/lib/contexts/game_context';
import { UserContext } from '@/lib/contexts/user_context';
import { GameInfo } from '@/lib/types/game_info';
import { UserInfo } from '@/lib/types/user_info';

import Button from '../ui/button';
import IconText from '../ui/icon_text';

export default function GuessButton() {
	const {gameInfo, setGameInfo} = useContext(GameContext);
	const {setUserInfo} = useContext(UserContext);
	const [guessing, setGuessing] = useState(false);

	const guessButtonId = 'guess_button';

	function makeGuess() {
		if((document.getElementById(guessButtonId) as HTMLButtonElement).disabled) return;
		
		if(gameInfo.guess_mapset) {
			setGuessing(true);
			const opts: RequestInit = {
				method: 'POST',
				headers: { 'Content-type': 'application/json' },
				body: JSON.stringify(gameInfo)
			}
			fetch('/api/make_guess', opts).then((data: Response) => {
				data.json().then((game: GameInfo) => {
					setGameInfo(game);

					fetch('/api/user/me').then((data: Response) => {
						if(data.status !== 200) return;
						data.json().then((userInfo: UserInfo) => {
							setUserInfo(userInfo);
						});
					});
				});
			}).finally(() => setGuessing(false));
		}
	}

	return (<>
		<Button
			button={
				<button
					id={guessButtonId}
					onClick={makeGuess}
					disabled={guessing || !gameInfo.guess_mapset || gameInfo.guess_mapset < 0}
				>
					<IconText icon={'done'} text={'Guess'}></IconText>
				</button>
			}
			styles={[styles.guess_button_valid]}
		/>
	</>)
}
