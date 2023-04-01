import styles from '@/styles/modules/filters.module.css';

import { useContext, useEffect, useState } from 'react';

import { FiltersContext } from '@/lib/contexts/filters_context';
import { isFilterRanked } from '@/lib/types/next_song_params';

import Button from '../ui/button';
import Filter from './filter_select';
import IconText from '../ui/icon_text';

export default function Filters() {
	const {songFilters, } = useContext(FiltersContext);
	const [open, setOpen] = useState(false);
	const [nb_results, setNbResults] = useState(0);
	const [filters_ranked, setFiltersRanked] = useState(true);

	useEffect(() => {
		const opts: RequestInit = {
			method: 'POST',
			headers: { 'Content-type': 'application/json' },
			body: JSON.stringify(songFilters)
		}
		fetch('/api/filters_results', opts).then((data: Response) => {
			data.json().then((results: number) => {
				setNbResults(results);
			});
		});

		setFiltersRanked(isFilterRanked(songFilters));
	}, [songFilters]);

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
	
	const optionsStatus = [
		{ value: 'all', label: 'All Status'},
		{ value: '1', label: 'Ranked Only'},
		{ value: '4', label: 'Loved Only'}
	];

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
					<Filter filter_key={'status'} options={optionsStatus}></Filter>
					<div className={styles.nb_results}>Results: {nb_results}</div>
					<div className={styles.is_ranked}>Counts for wins: <span className={filters_ranked ? styles.is_ranked_true : styles.is_ranked_false}>{filters_ranked ? 'YES' : 'NO'}</span></div>
				</div>
			}
		</div>
	</>)
}
