import { Hints } from "./hints";
import { getEmptyNextSongParams, NextSongParams } from "./next_song_params";

export type GameId = string;

export type GameInfo = {
	id: GameId,
	song_uri: string,
	song_length: number,
	params: NextSongParams
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
		params: getEmptyNextSongParams(),
		song_uri: '',
		song_length: 0,
		over: false
	};
}