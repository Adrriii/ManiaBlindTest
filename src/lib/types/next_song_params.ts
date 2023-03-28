export type SongFilters = {
	keys?: 'all' | '4' | '7',
	difficulty_min?: 'lowest' | number,
	difficulty_max?: 'highest' | number,
	year_min?: 'start' | number,
	year_max?: 'now' | number,
	status?: 'all' | '1' | '4',
}
// Status: 1=ranked, 4=loved

export function isFilterRanked(filters: SongFilters): boolean {
	if(filters.difficulty_max !== 'highest') return false;
	if(filters.difficulty_min !== 'lowest') return false;
	if(filters.year_min !== 'start') return false;
	if(filters.year_max !== 'now') return false;
	if(filters.status === '4') return false;
	console.log(filters);
	return true;
}

export function getEmptySongFilters(): SongFilters {
	return {
		keys: 'all',
		difficulty_min: 'lowest',
		difficulty_max: 'highest',
		year_min: 'start',
		year_max: 'now',
		status: 'all'
	};
}

export type NextSongParams = {
	filters: SongFilters
}

export function getEmptyNextSongParams(): NextSongParams {
	return {
		filters: getEmptySongFilters()
	};
}