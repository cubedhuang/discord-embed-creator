import { Head, Html, Main, NextScript } from "next/document";

export default function MyDocument() {
	const title = "Discord Embed Creator";
	const description =
		"A tool to build Discord embeds for discord.js and discord.py.";

	return (
		<Html>
			<Head>
				<meta
					name="viewport"
					content="initial-scale=1.0, width=device-width"
				/>
				<meta name="theme-color" content="#000000" />

				<title>{title}</title>
				<meta property="og:title" content={title} />
				<meta name="description" content={description} />
				<meta property="og:description" content={description} />
			</Head>
			<body>
				<Main />
				<NextScript />
			</body>
		</Html>
	);
}
