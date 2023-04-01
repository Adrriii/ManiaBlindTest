import { useRouter } from 'next/router';
import Site from '../../lib/components/site';
import User from '../../lib/components/user/user';

export default function UserPage() {
	const router = useRouter();
	const { osu_id } = router.query as unknown as {osu_id: number};

	return (<>
		<Site
			page={
				osu_id &&
				<User osu_id={osu_id}/>
			}
		/>
	</>)
}
