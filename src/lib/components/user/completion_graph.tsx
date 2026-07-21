import styles from '@/styles/modules/user.module.css';

import { useEffect, useState } from 'react';

import { UserCompletion } from '@/lib/db/user_score';

type CompletionGraphProps = {
	osu_id: number,
};

const Categories = ['X', 'SS', 'S', 'A', 'B', 'C', 'D'] as const;
type Category = typeof Categories[number];
type Segment = Category | 'Missed';

type YearBar = {
	yr: number,
	total: number,
	missed: number,
	segments: { grade: Segment, ratio: number }[],
	stack: number,
};

function buildBars(completion: UserCompletion[]): YearBar[] {
	return completion.map(c => {
		const segments: { grade: Segment, ratio: number }[] = Categories
			.map(grade => ({
				grade: grade as Segment,
				ratio: c.total > 0 ? (c[`grades_${grade}`] as number) / c.total : 0,
			}))
			.filter(s => s.ratio > 0);

		const missed = c.total > 0 ? (c.missed || 0) / c.total : 0;
		if(missed > 0) segments.push({ grade: 'Missed', ratio: missed });

		return {
			yr: c.yr,
			total: c.total,
			missed: c.missed || 0,
			segments,
			stack: segments.reduce((sum, s) => sum + s.ratio, 0),
		};
	});
}

function segmentColor(grade: Segment): string {
	return grade === 'Missed' ? 'var(--grade-missed)' : `var(--grade-${grade.toLowerCase()})`;
}

function formatPct(v: number): string {
	return `${(v * 100).toFixed(v < 0.01 ? 2 : 1)}%`;
}

export default function CompletionGraph({ osu_id }: CompletionGraphProps) {
	const [userCompletion, setUserCompletion] = useState<UserCompletion[] | null>(null);

	useEffect(() => {
		if(osu_id <= 0) return;

		fetch(`/api/user/${osu_id}/completion`).then((data: Response) => {
			if(data.status !== 200) return;

			data.json().then((completion: UserCompletion[]) => setUserCompletion(completion));
		});
	}, [osu_id]);

	if(osu_id <= 0) return null;

	const bars = userCompletion ? buildBars(userCompletion) : [];
	const peak = bars.reduce((m, b) => Math.max(m, b.stack), 0);
	const scale = peak > 0 ? peak * 1.12 : 1;
	const ticks = [0, 0.25, 0.5, 0.75, 1];
	const all_segments: Segment[] = [...Categories, 'Missed'];
	const legend = all_segments.filter(g => bars.some(b => b.segments.some(s => s.grade === g)));

	return (<>
		<div className={styles.completion_graph}>
			{
				(userCompletion !== null && bars.length > 0) ? (<>
					<div className={styles.completion_head}>
						<span className={styles.completion_title}>Completion by year</span>
						<div className={styles.completion_legend}>
							{
								legend.map(g =>
									<span key={g} className={styles.completion_legend_item}>
										<i style={{ background: segmentColor(g) }}/>
										{g}
									</span>
								)
							}
						</div>
					</div>

					<div className={styles.completion_plot}>
						<div className={styles.completion_yaxis}>
							{
								ticks.map(t =>
									<span key={t} className={styles.completion_ytick} style={{ bottom: `${t * 100}%` }}>
										{formatPct(t * scale)}
									</span>
								)
							}
						</div>

						<div className={styles.completion_area}>
							<div className={styles.completion_canvas}>
								{
									ticks.map(t =>
										<div key={t} className={styles.completion_gridline} style={{ bottom: `${t * 100}%` }}/>
									)
								}
								<div className={styles.completion_bars}>
									{
										bars.map(b =>
											<div key={b.yr} className={styles.completion_col}>
												<div
													className={styles.completion_stack}
													style={{ height: `${(b.stack / scale) * 100}%` }}
													title={`${b.yr}: ${formatPct(b.stack - (b.total > 0 ? b.missed / b.total : 0))} done, ${b.missed} missed, ${b.total} maps`}
												>
													{
														b.segments.map(s =>
															<div
																key={s.grade}
																className={styles.completion_seg}
																style={{
																	height: `${(s.ratio / b.stack) * 100}%`,
																	background: segmentColor(s.grade),
																}}
															/>
														)
													}
												</div>
											</div>
										)
									}
								</div>
							</div>

							<div className={styles.completion_years}>
								{ bars.map(b => <span key={b.yr} className={styles.completion_year}>{b.yr}</span>) }
							</div>
						</div>
					</div>
				</>) :
				<div className={styles.completion_empty}>
					{ userCompletion === null ? 'Loading completion...' : 'No completion data yet' }
				</div>
			}
		</div>
	</>)
}
