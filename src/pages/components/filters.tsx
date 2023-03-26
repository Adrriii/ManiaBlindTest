import { FiltersContext } from '@/lib/contexts/filters_context';
import styles from '@/styles/modules/filters.module.css';
import { useContext, useState } from 'react';
import Button from './button';
import Filter from './filter_select';
import IconText from './icon_text';

export default function Filters() {
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
					<Filter filter_key={'keys'} options={[
						{ value: 'all', label: 'All Keys' },
						{ value: '4', label: '4K' },
						{ value: '7', label: '7K' },
					]}></Filter>
				</div>
			}
		</div>
	</>)
}
