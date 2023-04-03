import styles from '@/styles/modules/about.module.css';

export default function About() {

	return (<>
		<div className={styles.about}>
			<p>This game is free, open source and without any kind of paid feature or support, you can find the code on <a href="https://github.com/Adrriii/ManiaBlindTest" target='_blank'>GitHub</a>. Feel free to open issues for bug reports and feature requests.</p>
			<section>To the players</section>
			<p>Different mapsets of the same songs are merged as much as possible to avoid having the same entries available in the search, which would cause confusion and RNG. If you find occurences of wrong metadata resulting in duplicates, please report them on the github page.</p>
			<p>Songs are entirely provided from osu! beatmaps from the Ranked and Loved section. New songs will be added periodically by an automated procedure, but it is monitored manually at the moment.</p>
			<p>Some filters are used to trim many mapsets that are deemed uninteresting by my personal bias, such as all kinds of TV Size songs. Some may persist depending on their metadata.</p>
			<p>For performance reasons, access might be limited to authenticated osu! users at some point. For now there is no concern.</p>
			<p>And no, I haven&apos;t yet planned to support mobile browsers efficiently. In case you didn&apos;t notice already, I&apos;m a terrible front-end dev & designer. Just look at the font I picked.</p>
			<section>To right holders</section>
			<p>I will comply with any takedown requests even though all distributed songs are cut to a maximum of 1:30 anyway and are barely of any use except for this game. But I&apos;ll respect if an artist doesn&apos;t want their song(s) in here.</p>
			<section>To developers</section>
			<p>This website is only possible with the use of data from <a href="https://osudaily.net/" target="_blank">osu!daily</a>. But you may still reproduce, clone or do whatever you want with this concept, don&apos;t need to ask, in the case you wondered.</p>
			<p>Enjoy !</p>
		</div>
	</>)
}
