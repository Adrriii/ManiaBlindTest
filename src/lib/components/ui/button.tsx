import btnstyle from '@/styles/modules/button.module.css';
import { ReactNode } from 'react';

type ButtonProps = {
	button: ReactNode
	styles?: string[]
}

export default function Button({ button, styles }: ButtonProps) {

	return (<>
		<div className={`${btnstyle.button} ${styles?.join(' ')}`}>
			{button}
		</div>
	</>)
}
