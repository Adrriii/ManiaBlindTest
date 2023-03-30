import Score, { ScoreFull } from '@/lib/types/score';
import styles from '@/styles/modules/score_thumb.module.css';

type ScoreThumbProps = {
	score_full: ScoreFull,
	mode: 'song' | 'user'
};
export default function ScoreThumb({ score_full, mode }: ScoreThumbProps) {

	return (<>
		{
			score_full &&
			<div className={styles.score_thumb}>
				<div className={styles.score_grade}><img src={`/grades/${Score.getScoreGrade(score_full.score)}.png`}/></div>
				{
					mode === 'song' &&
					<div className={styles.score_song}>{score_full.song.artist} - {score_full.song.title}</div>
				}
				{
					mode === 'user' &&
					<div className={styles.score_user}>{score_full.user.username}</div>
				}
				<div className={styles.score_score}>{score_full.score.score}</div>
				<div className={styles.score_time}>{(score_full.score.time_ms / 1000).toFixed(2)}s</div>
			</div>
	}
	</>)
}
