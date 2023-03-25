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

	initGameSong(gameInfo: GameInfo, song: Song): Promise<(ServerSong | null)[]> {
		const calls: Promise<ServerSong | null>[] = [];

		calls.push(new Promise<ServerSong | null>((resolve) => {
			(new ServerSong(song)).init().then((songReady) => {
				this.songs.set(gameInfo.id, songReady);

				// Free up the memory after one hour (for now)
				setTimeout(() => {
					this.songs.delete(gameInfo.id);
				}, 3600000)
				resolve(songReady);
			})
		}));
		
		calls.push(new Promise<ServerSong | null>((resolve) => {
			const audio = `${process.env.SONG_DIR}/${song.hash_id}/${song.hash_id}.mp3`;
			const dest = `${process.env.SONG_DIR}/games/${gameInfo.id}`;
			const game_audio = `${dest}/${gameInfo.id}.mp3`;

			fs.mkdirSync(dest, { recursive: true });
			fs.copyFileSync(audio, game_audio);

			// Delete the file after 1 hour (safe time to be paused)
			setTimeout(() => {
				try {
					fs.unlinkSync(game_audio);
					fs.rmdirSync(dest);
				} catch(e) {
					console.error(e);
				}
			}, 3600000);
			
			resolve(null);
		}));

		return Promise.all(calls);
	}
}

const songs = new Songs();

export default songs;