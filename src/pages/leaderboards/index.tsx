import Leaderboards from '@/lib/components/leaderboards';
import Site from '../../lib/components/site';

export default function LeaderboardsPage() {

	return (<>
		<Site
			page={
				<Leaderboards/>
			}
		/>
	</>)
}
