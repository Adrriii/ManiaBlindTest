import { Mapset } from '@/lib/db/beatmap';
import games from '../../../lib/memory/games';
import songs from '../../../lib/memory/songs';
import { GameId, GameInfo } from '../../../lib/types/game_info';
import { HintCreator } from '../../../lib/types/hints';
import type { NextApiRequest, NextApiResponse } from 'next';

function setNextHint(current: GameInfo): GameInfo {
	const answers = songs.getSong(current.id)?.mapsets as Map<number, Mapset>;
	const answer = answers.get(answers.keys().next().value as number) as Mapset;

	if(!current.hints.banner_url) {
		current.hints.banner_url = HintCreator.getBannerUrl(answer);
		return current;
	}

	if(current.hints.mappers.length === 0) {
		current.hints.mappers = HintCreator.getMappers(answers);
		return current;
	}

	if(current.hints.rank_dates.length === 0) {
		current.hints.rank_dates = HintCreator.getRankDates(answers);
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

	if(!current.hints.title) {
		current.hints.title = HintCreator.getTitle(answer);
		games.gameOver(current);
		return current;
	}

	return current;
}
export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse<GameInfo | object>
) {
	const { game } = req.query;
	const gameInfo = games.getGame(game as GameId);

	if(gameInfo === null) {
		res.status(404).json({error: 'Invalid game'});
		return;
	}
	
	res.status(200).json(setNextHint(gameInfo));
}
