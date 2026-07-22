import type { NextApiRequest, NextApiResponse } from 'next';
import { getCookie } from 'cookies-next';

import { ApiError } from '@/lib/types/api_error';
import { getCurrentUserInfo } from '@/lib/types/user_info';
import { reportSamePair, ReportResult } from '@/lib/db/song_report';

export type ReportBody = {
	guess_mapset: number,
	answer_mapset: number,
};

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse<{ result: ReportResult } | ApiError>
) {
	if(req.method !== 'POST') {
		res.status(405).json({ error: 'method_not_allowed' } as ApiError);
		return;
	}

	const auth_token = getCookie(process.env.NEXT_PUBLIC_AUTH_COOKIE as string, { req, res })?.valueOf() as string | undefined;
	const userInfo = await getCurrentUserInfo(auth_token);

	if(userInfo.osu_id <= 0) {
		res.status(401).json({ error: 'login_required' } as ApiError);
		return;
	}

	const body = req.body as ReportBody;
	const guess_mapset = Number(body?.guess_mapset);
	const answer_mapset = Number(body?.answer_mapset);

	if(!Number.isFinite(guess_mapset) || !Number.isFinite(answer_mapset) || guess_mapset <= 0 || answer_mapset <= 0) {
		res.status(400).json({ error: 'invalid_mapsets' } as ApiError);
		return;
	}

	res.status(200).json({ result: await reportSamePair(userInfo.osu_id, guess_mapset, answer_mapset) });
}
