import query from "../db/db";
import Crypto from 'crypto';
import fs from 'fs';
import { Song } from "../db/song";
import { GameId, GameInfo, getEmptyGameInfo } from "../types/game_info";
import songs from "./songs";
import { ServerSong } from "./server_song";
import { Mapset } from "../db/beatmap";
import { NextSongParams, SongFilters } from "../types/next_song_params";

export class Games {
	games: Map<GameId, GameInfo>;

	constructor() {
		const opt: fs.RmOptions = { recursive: true, force: true };
		fs.rm(`${process.env.SONG_DIR}/games`, opt, () => { return; });
		this.games = new Map();
	}

	getGame(id: GameId): GameInfo | null {
		return this.games.has(id) ? this.games.get(id) as GameInfo : null;
	}

	async newGame(params: NextSongParams): Promise<GameInfo> {
		const game = getEmptyGameInfo();
		let song: Song;
	
		do {
			song = await this.nextSong(params.filters);
		} while(!this.tryHash(song.hash_id))
		
		game.id = this.randomGameId();

		const serverSong = 
			(await songs.initGameSong(game, song))
			.filter((song) => song != null)[0] as ServerSong;
		
		game.song_uri = `${process.env.SONG_URI}/games/${game.id}/${game.id}.mp3`;
		game.song_length = serverSong.getSome().total_length as number;
		game.params = params;

		this.games.set(game.id, game);

		return game;
	}

	gameOver(game: GameInfo): void {
		game.over = true;
		this.games.delete(game.id);
	}

	private tryHash(hash: string): boolean {
		const dir = `${process.env.SONG_DIR}/${hash}`;
		
		return fs.existsSync(dir)
			&& fs.existsSync(`${dir}/${hash}.mp3`);
	}
	
	private async nextSong(filters: SongFilters): Promise<Song> {
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

		const mapset = (await query('SELECT * FROM osu_allbeatmaps WHERE mode = 3 AND approved_date > "2005-01-01" '+conditions.join(' ')+' ORDER BY RAND() LIMIT 1', values) as Mapset[])[0];
		const result = (await query('SELECT * FROM song WHERE nomp3 = 0 AND beatmapset_id = '+mapset.beatmapset_id, [], 'blindtest') as Song[])

		return result.length > 0 ? result[0] : { hash_id: '', beatmapset_id: -1, nomp3: true};
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