import { Mapset } from "../db/beatmap";

export class HintCreator {
	static getBannerUrl(answer: Mapset): string {
		return `https://assets.ppy.sh/beatmaps/${answer?.beatmapset_id}/covers/cover@2x.jpg`;
	}

	static getArtist(answer: Mapset): string {
		return answer?.artist as string;
	}

	static getMappers(answers: Map<number, Mapset>): string[] {
		return Array.from(answers.values()).map((mapset) => mapset.creator);
	}

	static getRankDates(answers: Map<number, Mapset>): string[] {
		return Array.from(answers.values()).map((mapset) => mapset.approved_date);
	}

	static getDiffs(answers: Map<number, Mapset>): string[][] {
		return Array.from(answers.values()).map((mapset) => mapset.beatmaps.map((beatmap) => beatmap.version));
	}
	
	static getTitle(answer: Mapset): string {
		return answer?.title as string;
	}
}

export type Hints = {
	status: number,
	banner_url: string,
	artist: string,
	mappers: string[],
	rank_dates: string[],
	mapsets_diffs: string[][],
	title: string,
}