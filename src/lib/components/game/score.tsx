import styles from '@/styles/modules/score.module.css';
import { useContext, useEffect, useRef, useState } from 'react';
import ScoreLib from '@/lib/types/score';
import { GameContext } from '@/lib/contexts/game_context';
import { UserContext } from '@/lib/contexts/user_context';
import { ScoresResponse } from '../../../pages/api/mapset/[hash_id]/scores';
import ScoreThumb from '../user/score_thumb';

type ReportState = 'idle' | 'sending' | 'ok' | 'duplicate' | 'failed';

function reportMessage(state: ReportState): string {
	switch(state) {
		case 'sending': return 'Reporting...';
		case 'ok': return 'Thanks, reported';
		case 'duplicate': return 'Already known';
		case 'failed': return 'Report failed';
		default: return 'Same song ? Report it';
	}
}

export default function Score() {
	const {gameInfo, } = useContext(GameContext);
	const {userInfo, } = useContext(UserContext);
	const [reportState, setReportState] = useState<ReportState>('idle');
	const [score, setScore] = useState(ScoreLib.computeScore(gameInfo));
	const [scores, setScores] = useState<ScoresResponse | null>(null);
	const once = useRef(false);

	useEffect(() => {
		if(!gameInfo.over) {
			once.current = false;
			setScores(null);
		}
		if(gameInfo.over && gameInfo.answer) {
			if(once.current) return;
			once.current = true;

			fetch(`/api/mapset/${gameInfo.answer.hash_id}/scores`).then((data: Response) => {
				if(data.status !== 200) return;

				data.json().then((scores: ScoresResponse) => {
					setScores(scores);
				});
			});
		}
	}, [gameInfo]);

	useEffect(() => {
		setReportState('idle');
	}, [gameInfo.id]);

	function reportSame() {
		if(reportState !== 'idle' || !gameInfo.answer) return;

		setReportState('sending');

		const opts: RequestInit = {
			method: 'POST',
			headers: { 'Content-type': 'application/json' },
			body: JSON.stringify({
				guess_mapset: gameInfo.guess_mapset,
				answer_mapset: gameInfo.answer.beatmapset_id,
			})
		};

		fetch('/api/report_same', opts).then((data: Response) => {
			if(data.status !== 200) {
				setReportState('failed');
				return;
			}

			data.json().then((res: { result: string }) => {
				setReportState(res.result === 'ok' ? 'ok' : 'duplicate');
			});
		}).catch(() => setReportState('failed'));
	}

	useEffect(() => {
		const interval = setInterval(() => {
			if(gameInfo.start_time !== -1) {
				setScore(ScoreLib.computeScore(gameInfo));
			}
		}, 50);

		return () => clearInterval(interval);
	}, [gameInfo]);

	return (<>
		<div className={styles.score}>
			{
				gameInfo.id && (!gameInfo.over || (gameInfo.over && gameInfo.win)) &&
				<div className={styles.score_number}>
					Score: { score }
				</div>
			}
			{
				(gameInfo.over && !gameInfo.win && gameInfo.guesses_used > 0) && (<>
					<div className={styles.score_wrong}>
						Wrong ! You guessed <span className={styles.score_wrong_guess}>{gameInfo.guess_song}</span>
					</div>
					{
						userInfo && userInfo.osu_id > 0 && gameInfo.answer &&
						<button
							className={styles.score_report}
							onClick={reportSame}
							disabled={reportState !== 'idle'}
							title="Report this guess and the answer as the same song"
						>{reportMessage(reportState)}</button>
					}
				</>)
			}
			{
				(gameInfo.end_time > 0 && gameInfo.win) &&
				<div className={styles.score_time}>
					in { ((gameInfo.end_time - gameInfo.start_time) / 1000).toFixed(2) } seconds
				</div>
			}
			{
				(scores && scores.own_score) &&
				<div className={styles.own_score}>
					<ScoreThumb 
						score_full={scores.own_score}
						highlight={true}
						mode={'user'}
					/>
				</div>
			}
			{
				scores &&
				<div className={styles.leaderboard}>
					{
						scores.scores.sort((a, b) => (a.score.rank as number) - (b.score.rank as number)).map(score_full =>
							<ScoreThumb 
								key={score_full.user.osu_id}
								score_full={score_full}
								mode={'user'}
								highlight={scores.own_score && score_full.user.osu_id === scores.own_score.user.osu_id}
								hide_first={scores.own_score && scores.own_score.score.rank === 1}
							/>
						)
					}
				</div>
			}
		</div>
	</>)
}
