import styles from '@/styles/modules/user.module.css';
import Score, { ScoreGrade } from '../../types/score';

type GradeDisplayProps = {
	grade: ScoreGrade
	count: number
}

export default function GradeDisplay({ grade, count }: GradeDisplayProps) {

	return (<>
		<div className={styles.grade_display}>
			<div className={styles.profile_grade_image}><img src={`/grades/${Score.getGradeImage(grade)}.png`} alt={grade}/></div>
			<div
				className={styles.profile_grade_count}
				style={{ color: `var(--grade-${Score.getGradeImage(grade).toLowerCase()})` }}
			>{count}</div>
		</div>
	</>)
}
