import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
	return (
		<Html lang="en">
			<Head>
				<link
					rel="preload"
					href="/fonts/VT323-Regular.ttf"
					as="font"
					type="font/ttf"
					crossOrigin="anonymous"
				/>
				<link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
				<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&display=block" />
			</Head>
			<body>
				<Main />
				<NextScript />
			</body>
		</Html>
	)
}
