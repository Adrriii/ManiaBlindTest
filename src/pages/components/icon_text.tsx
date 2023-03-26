import styles from '@/styles/modules/icon_text.module.css';

type IconTextProps = {
	icon: string,
	text:string
}

export default function IconText({ icon, text }: IconTextProps) {

	return (<>
		<div className={styles.icon_text}>
			<span className={`material-symbols-outlined ${styles.icon}`}>{icon}</span>
			<span className={styles.text}>{text}</span>
		</div>
	</>)
}
