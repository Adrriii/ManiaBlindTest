export type SongFilters = {
	keys?: 'all' | '4' | '7',
	difficulty_min?: 'lowest' | number,
	difficulty_max?: 'highest' | number,
	year_min?: 'start' | number,
	year_max?: 'now' | number,
}

export function getEmptySongFilters(): SongFilters {
	return {
		keys: 'all',
		difficulty_min: 'lowest',
		difficulty_max: 'highest',
		year_min: 'start',
		year_max: 'now',
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