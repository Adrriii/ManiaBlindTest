import Game from '../lib/components/game/game';
import Site from '../lib/components/site';

export default function Home() {

	return (<>
		<Site
			page={
				<Game/>
			}
		/>
	</>)
}
