import moment from "moment";
import { Song } from "../db/song";
import { UserScore } from "../db/user_score";
import { GameInfo } from "./game_info";
import { UserInfo } from "./user_info";

const hintCosts = [
	5000, 		// date
	25000,		// mapper
	70000,		// versions (rarely contains answer)
	100000,		// artist 	(often makes it very easy to select)
	100000,		// background (often show the title itself)
	1000000,	// title = give up
]

export type ScoreFull = {
	score: UserScore,
	user: UserInfo,
	song: Song
}

export const Grades = ['X', 'SS', 'S', 'A', 'B', 'C', 'D', 'F'] as const;
export type ScoreGrade = typeof Grades[number];

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

	static getScoreGrade(score: Pick<UserScore, 'score' | 'hints_used'>): ScoreGrade {
		if(score.score === 1000000) return 'X';
		if(score.score >= 990000) return 'SS';
		if(score.score >= 950000) return 'S';
		if(score.score >= 850000 && score.hints_used === 0) return 'S';
		if(score.score >= 800000) return 'A';
		if(score.score >= 600000) return 'B';
		if(score.score >= 500000) return 'C';
		if(score.score > 0) return 'D';
		return 'F';
	}
}