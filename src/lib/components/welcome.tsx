import styles from '@/styles/modules/game.module.css';

import { useContext } from 'react';
import { UserContext } from '@/lib/contexts/user_context';

export default function Welcome() {
	const {userInfo, } = useContext(UserContext);
	const logged_in = !!userInfo && userInfo.osu_id > 0;

	return (<>
		<div className={styles.welcome}>
			<h1 className={styles.welcome_title}>Guess the map</h1>
			<p className={styles.welcome_tagline}>
				A random <span className={styles.ranked}>Ranked</span> or <span className={styles.loved}>Loved</span> osu!mania
				song starts playing. Guess it as fast as you can.
			</p>

			<ol className={styles.welcome_steps}>
				<li>
					<span className={styles.welcome_step_n}>1</span>
					<span className={styles.welcome_step_text}>Listen to the clip.</span>
				</li>
				<li>
					<span className={styles.welcome_step_n}>2</span>
					<span className={styles.welcome_step_text}>Search the song or artist and pick it from the results.</span>
				</li>
				<li>
					<span className={styles.welcome_step_n}>3</span>
					<span className={styles.welcome_step_text}>Stuck? Reveal hints, but every hint costs you points.</span>
				</li>
			</ol>

			<p className={styles.welcome_note}>
				{
					logged_in ?
					'The faster you answer and the fewer hints you take, the higher your score.' :
					'Log in with osu! (top right ↗) to save your scores and climb the leaderboard.'
				}
			</p>
		</div>
	</>)
}
