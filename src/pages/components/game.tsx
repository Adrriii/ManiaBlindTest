import styles from '@/styles/modules/game.module.css';
import index_styles from '@/styles/modules/index.module.css';

import { UserContext } from '@/lib/contexts/user_context';
import { useContext, useState } from 'react';
import { GameContext } from '../../lib/contexts/game_context';
import { GameInfo, getEmptyGameInfo } from '../../lib/types/game_info';

import Hint from './hint';
import PlayRandom from './play_random';
import Result from './result';
import Score from './score';

export default function Game() {
	const {userInfo, setUserInfo} = useContext(UserContext);
	const [gameInfo, setGameInfo] = useState<GameInfo>(getEmptyGameInfo());
	const gameContext = {gameInfo, setGameInfo};

	return (<>
		{
			!userInfo &&
			<div className={index_styles.center_big}>
				Loading...
			</div>
		}
		<div className={styles.game_container}>
			{
				userInfo &&
				<div className={styles.game}>
					<GameContext.Provider value={gameContext} >
						<PlayRandom/>
						<Hint/>
						<Result/>
						<Score/>
					</GameContext.Provider>
				</div>
			}
		</div>
	</>)
}
