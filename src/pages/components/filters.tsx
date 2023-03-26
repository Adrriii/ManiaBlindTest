import { FiltersContext } from '@/lib/contexts/filters_context';
import styles from '@/styles/modules/filters.module.css';
import { useContext, useState } from 'react';
import Button from './button';
import IconText from './icon_text';

export default function Filters() {
	const {songFilters, setSongFilters} = useContext(FiltersContext);
	const [open, setOpen] = useState(false);

	function Open() {
		setOpen(!open);
	}

	return (<>
		<div className={styles.filters}>
			<Button button={
				<button onClick={Open}>
					<IconText icon={open ? 'close' : 'filter_list'} text={'Filters'}></IconText>
				</button>
			}></Button>
			{
				open &&
				<div className={styles.filter_panel}>

				</div>
			}
		</div>
	</>)
}
