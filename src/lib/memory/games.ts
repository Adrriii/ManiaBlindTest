import query from "../db/db";
import Crypto from 'crypto';
import fs from 'fs';
import { Song } from "../db/song";
import { GameId, GameInfo, getEmptyGameInfo } from "../types/game_info";
import songs from "./songs";
import { ServerSong } from "./server_song";
import { Mapset } from "../db/beatmap";

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

	async newGame(): Promise<GameInfo> {
		const game = getEmptyGameInfo();
		let song: Song;
	
		do {
			song = await this.nextSong();
		} while(!this.tryHash(song.hash_id))
		
		game.id = this.randomGameId();

		const serverSong = 
			(await songs.initGameSong(game, song))
			.filter((song) => song != null)[0] as ServerSong;
		
		game.song_uri = `${process.env.SONG_URI}/games/${game.id}/${game.id}.mp3`;
		game.song_length = serverSong.getSome().total_length as number;

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
	
	private async nextSong(): Promise<Song> {
		const mapset = (await query('SELECT * FROM osu_allbeatmaps WHERE mode = 3 AND approved_date > "2005-01-01" ORDER BY RAND() LIMIT 1') as Mapset[])[0];
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