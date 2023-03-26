import { FiltersContext } from '@/lib/contexts/filters_context';
import { SongFilters } from '@/lib/types/next_song_params';
import fltrstyle from '@/styles/modules/filter.module.css';
import { SyntheticEvent, useContext, useEffect } from 'react';

type FilterProps = {
	filter_key: keyof SongFilters
	options: { value: string, label: string, default?: boolean}[]
	styles?: string[]
}

export default function Filter({ filter_key, options, styles }: FilterProps) {
	const {songFilters, setSongFilters} = useContext(FiltersContext);
	const filter_id = `${filter_key}_select`;

	function updateKey(evt: SyntheticEvent) {
		let filters = {...songFilters};
		filters[filter_key] = getSelect().value as any;
		setSongFilters(filters);
	}

	function getSelect(): HTMLSelectElement {
		return document.getElementById(filter_id) as HTMLSelectElement;
	}

	return (<>
		<div className={`${fltrstyle.filter} ${styles?.join(' ')}`}>
			<select id={filter_id} value={songFilters[filter_key]} onChange={updateKey}>
				{
					options.map(opt => {
						return <option value={opt.value} key={opt.value}>{opt.label}</option>
					})
				}
			</select>
		</div>
	</>)
}
