import styles from '@/styles/modules/user.module.css';
import { ScoreGrade } from '../../types/score';

type GradeDisplayProps = {
	grade: ScoreGrade
	count: number
}

export default function GradeDisplay({ grade, count }: GradeDisplayProps) {

	return (<>
		<div className={styles.grade_display}>
			<div className={styles.profile_grade_image}><img src={`/grades/${grade}.png`} alt={grade}/></div>
			<div className={styles.profile_grade_count}>{count}</div>
		</div>
	</>)
}
