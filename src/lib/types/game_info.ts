import { Hints } from "./hints";

export type GameId = string;

export type GameInfo = {
	id: GameId,
	song_uri: string,
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
		over: false
	};
}