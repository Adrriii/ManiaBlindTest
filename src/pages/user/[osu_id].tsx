import Site from '../components/site';
import User from '../components/user';

export default function UserPage({ osu_id }: {osu_id: number}) {
	const user_id = osu_id;

	return (<>
		<Site
			page={
				<User osu_id={user_id}/>
			}
		/>
	</>)
}
