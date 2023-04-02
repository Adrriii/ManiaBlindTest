import { Song } from "../db/song";
import { ServerSong } from "../memory/server_song";
import { Hints } from "./hints";
import { getEmptyNextSongParams, getEmptySongFilters, NextSongParams, SongFilters } from "./next_song_params";
import { getEmptyUserInfo, UserInfo } from "./user_info";

export type GameId = string;

export type ServerGame = {
	game: GameInfo,
	answer: ServerSong
}

export type GameInfo = {
	id: GameId,
	song_uri: string,
	song_length: number,
	params: NextSongParams
	hints: Hints,
	hints_used: number,
	over: boolean,
	win: boolean,
	guess_song: string,
	guess_mapset: number,
	guesses_used: number,
	start_time: number,
	end_time: number,
	score: number,
	filters: SongFilters,
	player: UserInfo,
	answer?: Song,
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
		hints_used: 0,
		params: getEmptyNextSongParams(),
		song_uri: '',
		song_length: 0,
		over: false,
		win: false,
		guess_song: '',
		guess_mapset: -1,
		guesses_used: 0,
		start_time: -1,
		end_time: -1,
		score: -1,
		player: getEmptyUserInfo(),
		filters: getEmptySongFilters()
	};
}