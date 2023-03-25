import { Hints } from "./hints";
import { SongInfo } from "./song_info"

export type GameId = string;

export type GameInfo = {
	id: GameId,
	song_info: SongInfo,
	hints: Hints
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
		song_info: {
			uri: '',
		}
	};
}