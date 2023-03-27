import styles from '@/styles/modules/game.module.css';
import { useState } from 'react';
import { GameContext } from '../../lib/contexts/game_context';
import { GameInfo, getEmptyGameInfo } from '../../lib/types/game_info';

import Hint from './hint';
import PlayRandom from './play_random';
import Result from './result';

export default function Game() {
	const [gameInfo, setGameInfo] = useState<GameInfo>(getEmptyGameInfo());
	const gameContext = {gameInfo, setGameInfo};

	return (<>
		<div className={styles.game_container}>
			<div className={styles.game}>
				<GameContext.Provider value={gameContext} >
					<PlayRandom/>
					<Hint/>
					<Result/>
				</GameContext.Provider>
			</div>
		</div>
	</>)
}
