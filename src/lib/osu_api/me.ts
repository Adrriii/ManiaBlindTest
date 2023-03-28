import { User } from "../db/user";
import { OsuEndpoint } from "./osu_endpoint";
import { OsuApiUser } from "./types/user";

export class OsuApiMe implements OsuEndpoint {
	
	call(user: User): Promise<OsuApiUser> {
		return new Promise((resolve, reject) => {
			const opts: RequestInit = {
				method: 'GET',
				headers: { 
					'Authorization': `Bearer ${user.access_token}`,
					'Content-Type': 'application/json',
					'Accept': 'application/json',
				},
			}
			fetch('https://osu.ppy.sh/api/v2/me', opts).then((data: Response) => {
				if(data.status !== 200) {
					reject(data);
					return;
				}
				data.json().then((response: OsuApiUser) => {
					resolve(response);
				});
			});
		});
	}
}