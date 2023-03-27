import moment from "moment";
import { GameInfo } from "./game_info";

const hintCosts = [
	5000, 		// date
	25000,		// mapper
	70000,		// versions (rarely contains answer)
	100000,		// artist 	(often makes it very easy to select)
	100000,		// background (often show the title itself)
	1000000,	// title = give up
]

export default class Score {

	static computeScore(game: GameInfo) {
		if(game.over && !game.win) return 0;

		let score = 1000000;

		for(let i = 0; i < game.hints_used; i++) {
			score -= hintCosts[i];
		}

		// 10 seconds to find for max score
		const time_match = game.end_time === -1 ? moment.now() : game.end_time;
		const max_score_time_seconds = 10;
		const time = Math.max(0, time_match - game.start_time - (max_score_time_seconds * 1000));

		score -= Math.pow(time, 2) / 5000;
		score = Math.floor(score);

		return Math.max(score, 0);
	}
}