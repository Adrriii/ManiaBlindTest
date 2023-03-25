import { Hints } from "./hints";

export type GameId = string;

export type GameInfo = {
	id: GameId,
	song_uri: string,
	song_length: number,
	hints: Hints,
	over: boolean
}

export function getEmptyGameInfo(): GameInfo {
	return {
		id: '',
		hints: {
			banner_url: '',
			artist: '',
			mappers: [],
			rank_dates: [],
			mapsets_diffs: [],
			title: '',
		},
		song_uri: '',
		song_length: 0,
		over: false
	};
}