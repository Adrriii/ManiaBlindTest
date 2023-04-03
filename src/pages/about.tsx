import About from '../lib/components/about';
import Site from '../lib/components/site';

export default function Home() {

	return (<>
		<Site
			page={
				<About/>
			}
		/>
	</>)
}
