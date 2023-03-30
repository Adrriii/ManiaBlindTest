import Game from './components/game';
import Site from './components/site';

export default function Home() {

	return (<>
		<Site
			page={
				<Game/>
			}
		/>
	</>)
}
