import Head from 'next/head'
import styles from '@/styles/modules/index.module.css'

import Header from './components/header';
import Game from './components/game';

export default function Home() {
	return (<>
		<Head>
			<title>osu!mania Blind Test</title>
			<meta name="description" content="Are you ready ?" />
			<meta name="viewport" content="width=device-width, initial-scale=1" />
			<link rel="icon" href="/favicon.png" />
		</Head>
		<main className={styles.main}>
			<Header/>
			<Game/>
		</main>
	</>)
}
