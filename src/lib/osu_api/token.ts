import { OsuEndpoint } from "./osu_endpoint";

export type OsuApiTokenResponse = {
	token_type: string,
	expires_in: number,
	access_token: string,
	refresh_token: string
}

export class OsuApiToken implements OsuEndpoint {

	call(code: number): Promise<OsuApiTokenResponse> {
		return new Promise((resolve, reject) => {
			const params = {
				'grant_type': 'authorization_code',
				'client_id': process.env.NEXT_PUBLIC_OSU_CLIENT_ID,
				'client_secret': process.env.OSU_SECRET_ID,
				'redirect_uri': `${process.env.NEXT_PUBLIC_SITE_URL}/oauth`,
				'code': code
			};
			const opts: RequestInit = {
				method: 'POST',
				headers: { 'Content-type': 'application/json' },
				body: JSON.stringify(params)
			}
			fetch('https://osu.ppy.sh/oauth/token', opts).then((data: Response) => {
				if(data.status !== 200) {
					reject(data);
					return;
				}
				data.json().then((token: OsuApiTokenResponse) => {
					resolve(token);
				});
			});
		});
	}
}