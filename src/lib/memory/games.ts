import query from "../db/db";
import Crypto from 'crypto';
import fs from 'fs';
import { Song } from "../db/song";
import { GameId, GameInfo, getEmptyGameInfo } from "../types/game_info";
import songs from "./songs";

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

		await songs.initGameSong(game, song);
		
		game.song_uri = `${process.env.SONG_URI}/games/${game.id}/${game.id}.mp3`;

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
		return (await query('SELECT * FROM song WHERE nomp3 = 0 ORDER BY RAND() LIMIT 1', [], 'blindtest') as Song[])[0];
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