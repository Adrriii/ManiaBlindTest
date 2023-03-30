import { useRouter } from 'next/router';
import Site from '../components/site';
import User from '../components/user';

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
