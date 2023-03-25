import { GameId, GameInfo } from "../types/game_info";
import { ServerSong } from "./server_song";
import fs from 'fs';
import { Song } from "../db/song";

export class Songs {
	
	songs: Map<GameId, ServerSong>;

	constructor() {
		this.songs = new Map();
	}

	getSong(gameId: GameId): ServerSong | null {
		return this.songs.has(gameId) ? this.songs.get(gameId) as ServerSong : null;
	}

	initGameSong(gameInfo: GameInfo, song: Song): Promise<unknown> {
		const calls: Promise<unknown>[] = [];

		const audio = `${process.env.SONG_DIR}/${song.hash_id}/${song.hash_id}.mp3`;
		const dest = `${process.env.SONG_DIR}/games/${gameInfo.id}`;

		calls.push(new Promise<void>((resolve) => {
			(new ServerSong(song)).init().then((songReady) => {
				this.songs.set(gameInfo.id, songReady);
				resolve();
			})
		}));
		
		calls.push(new Promise<void>((resolve) => {
			fs.mkdirSync(dest, { recursive: true });
			fs.copyFileSync(audio, `${dest}/${gameInfo.id}.mp3`);
			resolve();
		}));

		return Promise.all(calls);
	}
}

const songs = new Songs();

export default songs;