import query from "../db/db";
import Crypto from 'crypto';
import fs from 'fs';
import { Song } from "../db/song";
import { GameId, GameInfo, ServerGame, getEmptyGameInfo } from "../types/game_info";
import songs from "./songs";
import { ServerSong } from "./server_song";
import { Mapset } from "../db/beatmap";
import { isFilterRanked, NextSongParams, SongFilters } from "../types/next_song_params";
import { HintCreator } from "../types/hints";
import moment from "moment";
import Score from "../types/score";
import { addUserLoss, addUserWin } from '../db/user_stats';
import { UserInfo } from "../types/user_info";
import { addUserScore, getUserScore } from "../db/user_score";

type FilteredQuery = {query: string, values: string[]};

export class Games {
	games: Map<GameId, ServerGame>;

	constructor() {
		const opt: fs.RmOptions = { recursive: true, force: true };
		fs.rm(`${process.env.SONG_DIR}/games`, opt, () => { return; });
		this.games = new Map();
	}

	getGame(id: GameId): ServerGame | null {
		return this.games.has(id) ? this.games.get(id) as ServerGame : null;
	}

	async newGame(params: NextSongParams): Promise<GameInfo> {
		const game = getEmptyGameInfo();
		let song: Song;
		let someMapset: Mapset | undefined = undefined;
		let serverSong: ServerSong | undefined = undefined;
	
		do {
			song = await this.nextSong(params.filters);

			if(!this.tryHash(song.hash_id)) continue;
		
			game.id = this.randomGameId();
	
			serverSong = 
				(await songs.initGameSong(game, song))
				.filter((song) => song != null)[0] as ServerSong;
	
			someMapset = serverSong.getSome();
		} while(serverSong === undefined || someMapset === undefined)
		
		game.song_uri = `${process.env.SONG_URI}/games/${game.id}/${game.id}.mp3`;
		game.song_length = someMapset.total_length as number;
		game.params = params;
		game.start_time = moment.now();
		game.filters = params.filters;

		this.games.set(game.id, {
			game: game,
			answer: serverSong
		});

		return game;
	}

	makeGuess(game: GameInfo, userInfo: UserInfo): GameInfo |null {
		const serverGame = games.getGame(game.id);

		if(serverGame === null) {
			return null;
		}

		serverGame.game.guess_mapset = game.guess_mapset;
		serverGame.game.guess_song = game.guess_song;
		game = serverGame.game;

		game.guesses_used++;

		while(!game.over) {
			this.setNextHint(game);
		}

		if(serverGame?.answer.mapsets.has(game.guess_mapset)) {
			game.win = true;
			if(userInfo.osu_id > 0 && isFilterRanked(game.filters)) {
				addUserWin(userInfo.osu_id);
				const game_time = game.end_time - game.start_time;

				getUserScore(userInfo.osu_id, serverGame.answer.song.hash_id).then((score) => {
					let with_replace = true;
					if(score) {
						if(score.score > game.score) with_replace = false;
						if(score.score === game.score && score.time_ms <= game_time) with_replace = false;
					}
					addUserScore({
						osu_id: userInfo.osu_id,
						hash_id: serverGame.answer.song.hash_id,
						score: Score.computeScore(game),
						hints_used: game.hints_used,
						time_ms: game_time
					}, with_replace);
				})
			}
		} else {
			game.win = false;
			addUserLoss(userInfo.osu_id);
			addUserScore({
				osu_id: userInfo.osu_id,
				hash_id: serverGame.answer.song.hash_id,
				score: 0,
				hints_used: game.hints_used,
				time_ms: 0
			}, false);
		}

		return game;
	}

	gameOver(game: GameInfo): void {
		game.over = true;
		game.end_time = moment.now();
		game.score = Score.computeScore(game);
		this.games.delete(game.id);
	}
	
	setNextHint(current: GameInfo, request = false): GameInfo {
		const answers = songs.getSong(current.id)?.mapsets as Map<number, Mapset>;
		const answer = answers.get(answers.keys().next().value as number) as Mapset;
		if(request) current.hints_used++;

		if(current.hints.rank_dates.length === 0) {
			current.hints.rank_dates = HintCreator.getRankDates(answers);
			return current;
		}

		if(current.hints.mappers.length === 0) {
			current.hints.mappers = HintCreator.getMappers(answers);
			return current;
		}

		if(current.hints.mapsets_diffs.length === 0) {
			current.hints.mapsets_diffs = HintCreator.getDiffs(answers);
			return current;
		}

		if(!current.hints.artist) {
			current.hints.artist = HintCreator.getArtist(answer);
			return current;
		}

		if(!current.hints.banner_url) {
			current.hints.banner_url = HintCreator.getBannerUrl(answer);
			return current;
		}

		if(!current.hints.title) {
			current.hints.title = HintCreator.getTitle(answer);
			games.gameOver(current);
			return current;
		}

		return current;
	}

	async getFiltersNbResults(filters: SongFilters): Promise<number> {
		const filteredQuery = this.buildFilteredQuery(filters);

		return (await query(`SELECT COUNT(*) as result FROM (SELECT beatmapset_id ${filteredQuery.query} GROUP BY beatmapset_id) as t`, filteredQuery.values) as {result: number}[])[0].result;
	}

	private tryHash(hash: string): boolean {
		const dir = `${process.env.SONG_DIR}/${hash}`;
		
		return fs.existsSync(dir)
			&& fs.existsSync(`${dir}/${hash}.mp3`);
	}

	private buildFilteredQuery(filters: SongFilters): FilteredQuery {
		const conditions: string[] = [];
		const values: string[] = [];

		if(filters.keys && filters.keys !== 'all') {
			conditions.push('AND diff_size = ?');
			values.push(filters.keys);
		}

		if(filters.difficulty_min && filters.difficulty_min !== 'lowest') {
			conditions.push('AND difficultyrating >= ?');
			values.push(filters.difficulty_min.toString());
		}

		if(filters.difficulty_max && filters.difficulty_max !== 'highest') {
			conditions.push('AND difficultyrating < ?');
			values.push(filters.difficulty_max.toString());
		}

		if(filters.year_min && filters.year_min !== 'start') {
			conditions.push('AND YEAR(approved_date) >= ?');
			values.push(filters.year_min.toString());
		}

		if(filters.year_max && filters.year_max !== 'now') {
			conditions.push('AND YEAR(approved_date) < ?');
			values.push(filters.year_max.toString());
		}

		if(filters.status && filters.status !== 'all') {
			conditions.push('AND approved = ?');
			values.push(filters.status.toString());
		}

		return {
			query: 'FROM osu_allbeatmaps WHERE mode = 3 AND approved_date > "2005-01-01" '+conditions.join(' '),
			values: values
		};
	}
	
	private async nextSong(filters: SongFilters): Promise<Song> {
		const filteredQuery = this.buildFilteredQuery(filters);

		const mapset = (await query(`SELECT * ${filteredQuery.query} ORDER BY RAND() LIMIT 1`, filteredQuery.values) as Mapset[])[0];
		const result = (await query('SELECT * FROM song WHERE nomp3 = 0 AND beatmapset_id = '+mapset.beatmapset_id, [], 'blindtest') as Song[])

		return result.length > 0 ? result[0] : { hash_id: '', beatmapset_id: -1, nomp3: true, title: '', artist: ''};
	}

	private randomGameId(): GameId {
		let id;
		do {
			id = Crypto.randomBytes(21).toString('hex').slice(0, 21);
		} while(this.games.has(id));

		return id;
	}
}

const games = new Games();

export default games;