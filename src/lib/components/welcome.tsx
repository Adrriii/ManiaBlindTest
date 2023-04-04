import styles from '@/styles/modules/game.module.css';
export default function Button() {

	return (<>
		<div className={styles.welcome}>
			<p>Try to guess osu!mania songs from the <span className={styles.ranked}>Ranked</span> and <span className={styles.loved}>Loved</span> sections</p>
			<p>To save your scores and progression, login on the top right ↗</p>
			<p>Enjoy !</p>
		</div>
	</>)
}
