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

	const optionsDiffMin = [
		{ value: 'lowest', label: 'Diff Min'}
	];
	for(let d = 1; d <= 10; d++) {
		optionsDiffMin.push({ value: `${d}`, label: `min. ${d}*` });
	}

	const optionsDiffMax = [
		{ value: 'highest', label: 'Diff Max'}
	];
	for(let d = 1; d <= 10; d++) {
		optionsDiffMax.push({ value: `${d}`, label: `max. ${d}*` });
	}

	const optionsYearMin = [
		{ value: 'start', label: 'Start year'}
	];
	for(let d = 2014; d <= 2023; d++) {
		optionsYearMin.push({ value: `${d}`, label: `min. ${d}` });
	}

	const optionsYearMax = [
		{ value: 'now', label: 'End year'}
	];
	for(let d = 2014; d <= 2023; d++) {
		optionsYearMax.push({ value: `${d}`, label: `max. ${d}` });
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
					<Filter filter_key={'difficulty_min'} options={optionsDiffMin}></Filter>
					<Filter filter_key={'difficulty_max'} options={optionsDiffMax}></Filter>
					<Filter filter_key={'year_min'} options={optionsYearMin}></Filter>
					<Filter filter_key={'year_max'} options={optionsYearMax}></Filter>
				</div>
			}
		</div>
	</>)
}
