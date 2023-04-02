import styles from '@/styles/modules/user.module.css';

import dynamic from "next/dynamic";
const Plot = dynamic(() => import("react-plotly.js"), { ssr: false, })

import { useEffect, useState } from 'react';

import { UserCompletion } from '@/lib/db/user_score';
import { PlotData } from 'plotly.js';
import moment from 'moment';

type CompletionGraphProps = {
	osu_id: number,
};

const PlotCategories = ['X', 'SS', 'S', 'A', 'B', 'C', 'D', 'Missing'] as const;
type PlotCategory = typeof PlotCategories[number];
type PlotlyDatas = {
	[grade in PlotCategory]: PlotData;
};

function getGradeMarker(grade: PlotCategory) {
	const result = {
		color: getGradeColor(grade),
		size: 1
	}

	return result;
}

function getGradeColor(grade: PlotCategory): string {
	let color = 'rgba(255,0,0,.1)';
	const fade = .75;
	
	switch(grade) {
		case 'X':
			color = `rgba(255,	255,	255,	${fade})`;
			break;
		case 'SS':
			color = `rgba(255,	153,	0,		${fade})`;
			break;
		case 'S':
			color = `rgba(255,	217,	0,		${fade})`;
			break;
		case 'A':
			color = `rgba(0,		255,	0,		${fade})`;
			break;
		case 'B':
			color = `rgba(0,		0,		255,	${fade})`;
			break;
		case 'C':
			color = `rgba(255,	0,		255,	${fade})`;
			break;
		case 'D':
			color = `rgba(255,	0,		0,		${fade})`;
			break;
	}

	return color;
}

export default function CompletionGraph({ osu_id }: CompletionGraphProps) {
	const [userCompletion, setUserCompletion] = useState<UserCompletion[] | null>(null);
	const [data, setData] = useState<PlotData[] | null>(null);

	const yr_begin = 2013;
	const yr_end = parseInt(moment().format('YYYY'));

	const layout: Partial<Plotly.Layout> = {
		plot_bgcolor: "rgba(0,0,0,0)",
		paper_bgcolor: "rgba(0,0,0,0)",
		barmode: 'stack',
		legend: {
			font: {
				color: 'rgba(255,255,255,1)'
			}
		},
		margin: {
			t: 0,
			b: 30,
			l: 50,
			r: 0
		},
		yaxis: {
			tickcolor: "rgba(0,0,0,0)",
			gridcolor: "rgba(0,0,0,0)",
			zerolinecolor: "rgba(0,0,0,0)",
			// range: [0,100]
			color: "rgba(255,255,255,1)",
			tickformat: ".2%"
		},
		xaxis: {
			tickcolor: "rgba(0,0,0,0)",
			gridcolor: "rgba(0,0,0,0)",
			zerolinecolor: "rgba(0,0,0,0)",
			range: ['2013-01-01',moment().format('YYYY')+'-12-31'],
			color: "rgba(255,255,255,1)",
			tickvals: Array.from(Array(yr_end - yr_begin + 1).keys()).map(y => y + yr_begin),
		},
	};

	useEffect(() => {
		if(userCompletion !== null) {
			const data: PlotData[] = [];
			const datas = {} as PlotlyDatas;
			
			PlotCategories.forEach(category => {
				datas[category] = {
					x: [],
					y: [],
					name: category,
					type: "bar",
					marker: getGradeMarker(category),
				} as never;
			});

			PlotCategories.filter(c => c !== 'Missing').forEach(c => {
				userCompletion.map((current: UserCompletion) => {
					const k: keyof UserCompletion = 'grades_'+c as keyof UserCompletion;
					(datas[c].x as number[]).push(current.yr);
					(datas[c].y as number[]).push(current[k] / current.total);
				});
			});

			PlotCategories.forEach(category => {
				data.push(datas[category]);
			});

			setData(data);
		}
	}, [userCompletion]);

	useEffect(() => {
		if(osu_id > 0) {
			fetch(`/api/user/${osu_id}/completion`).then((data: Response) => {
				if(data.status !== 200) return;
	
				data.json().then((completion: UserCompletion[]) => setUserCompletion(completion))
			});
		}
	}, [osu_id]);

	return (<>
		{
			(osu_id > 0 && data !== null) &&
			<div className={styles.completion_graph}>
				<Plot data={data} layout={layout} />
			</div>
		}
	</>)
}
