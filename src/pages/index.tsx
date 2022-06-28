import { useRouter } from "next/router";
import { useEffect, useState } from "react";

import Copier from "../components/Copier";
import DiscordEmbed from "../components/DiscordEmbed";
import LimitedInput from "../components/LimitedInput";
import Output from "../components/Output";
import type { Embed } from "../lib/interfaces";

function ellipses(str: string, max = 32) {
	return str.length > max ? `${str.slice(0, max - 3)}...` : str;
}

function button(type: "blue" | "red" | "disabled" = "blue") {
	return `font-medium py-1 px-2 rounded transition ${
		type === "blue"
			? "bg-[#5865f2] hover:bg-[#4752c4] text-white"
			: type === "red"
			? "bg-[#d83c3e] hover:bg-[#a12d2f] text-white"
			: "bg-[#4f545c] cursor-not-allowed"
	}`;
}

export default function Home() {
	const [authorIcon, setAuthorIcon] = useState("");
	const [authorName, setAuthorName] = useState("Example Author");
	const [authorUrl, setAuthorUrl] = useState("https://example.com");

	const [title, setTitle] = useState("Example Title");
	const [url, setUrl] = useState("https://example.com");

	const [description, setDescription] = useState(
		`This is an example description. Markdown works too!

https://automatic.links
> Block Quotes
\`\`\`
Code Blocks
\`\`\`
*Emphasis* or _emphasis_
\`Inline code\` or \`\`inline code\`\`
[Links](https://example.com)
<@123>, <@!123>, <#123>, <@&123>, @here, @everyone mentions
||Spoilers||
~~Strikethrough~~
**Strong**
__Underline__
`
	);

	const [fields, setFields] = useState([
		{
			name: "Field Name",
			value: "This is the field value.",
			inline: false
		},
		{
			name: "The first inline field.",
			value: "This field is inline.",
			inline: true
		},
		{
			name: "The second inline field.",
			value: "Inline fields are stacked next to each other.",
			inline: true
		},
		{
			name: "The third inline field.",
			value: "You can have up to 3 inline fields in a row.",
			inline: true
		},
		{
			name: "Even if the next field is inline...",
			value: "It won't stack with the previous inline fields.",
			inline: true
		}
	]);

	const [image, setImage] = useState(
		"https://cubedhuang.com/images/alex-knight-unsplash.webp"
	);
	const [thumbnail, setThumbnail] = useState(
		"https://dan.onl/images/emptysong.jpg"
	);

	const [color, setColor] = useState<string | undefined>("#00b0f4");

	const [footerText, setFooterText] = useState("Example footer!");
	const [footerIcon, setFooterIcon] = useState(
		"https://slate.dan.onl/slate.png"
	);

	const [timestamp, setTimestamp] = useState<number | undefined>(undefined);

	const [error, setError] = useState<string | undefined>(undefined);

	const [modal, setModal] = useState(false);

	const router = useRouter();

	useEffect(() => {
		const { save: embedQuery } = router.query;

		if (!embedQuery) return;

		router.push("/", "/", { shallow: true });

		const embedString = Array.isArray(embedQuery)
			? embedQuery[0]
			: embedQuery;

		try {
			const embed = JSON.parse(atob(embedString));

			setAuthorIcon(embed.author?.icon_url ?? "");
			setAuthorName(embed.author?.name ?? "");
			setAuthorUrl(embed.author?.url ?? "");

			setTitle(embed.title ?? "");
			setUrl(embed.url ?? "");
			setDescription(embed.description ?? "");

			setFields(embed.fields ?? []);

			setImage(embed.image?.url ?? "");
			setThumbnail(embed.thumbnail?.url ?? "");

			setColor(embed.color);

			setFooterText(embed.footer?.text ?? "");
			setFooterIcon(embed.footer?.icon_url ?? "");

			setTimestamp(embed.timestamp);
		} catch (e) {
			setError("Invalid imported embed!");
		}
	}, [router]);

	useEffect(() => {
		if (
			title.length +
				description.length +
				fields.reduce(
					(acc, cur) => acc + cur.name.length + cur.value.length,
					0
				) +
				footerText.length +
				authorName.length >
			6000
		) {
			setError(
				"The total number of characters in the embed content must not exceed 6000!"
			);
		}
	}, [title, description, fields, footerText, authorName]);

	const embed: Embed = {
		author: {
			name: authorName.trim(),
			iconUrl: authorIcon.trim(),
			url: authorUrl.trim()
		},
		title: title.trim(),
		url: url.trim(),
		description: description.trim(),
		fields: fields.map(field => ({
			name: field.name.trim(),
			value: field.value.trim(),
			inline: field.inline
		})),
		image: image.trim(),
		thumbnail: thumbnail.trim(),
		color: color?.trim(),
		footer: {
			text: footerText.trim(),
			iconUrl: footerIcon.trim()
		},
		timestamp
	};

	return (
		<div className="screen flex min-h-screen">
			<div className="flex-1 embed-inputs">
				<div>
					<div className="flex justify-between">
						<h1 className="text-white font-semibold text-2xl">
							Discord Embed Creator
						</h1>
						<a
							href="https://github.com/cubedhuang/discord-embed-creator"
							className="hover:underline"
						>
							GitHub
						</a>
					</div>

					<div className="flex mt-2 gap-2">
						<button
							type="button"
							onClick={() => {
								setAuthorName("");
								setAuthorIcon("");
								setAuthorUrl("");
								setTitle("");
								setUrl("");
								setDescription("");
								setFields([]);
								setImage("");
								setThumbnail("");
								setColor(undefined);
								setFooterText("");
								setFooterIcon("");
								setTimestamp(undefined);
							}}
							className={button("red")}
						>
							Clear All
						</button>

						<button
							type="button"
							onClick={() => {
								for (const details of Array.from(
									document.getElementsByTagName("details")
								)) {
									details.open = true;
								}
							}}
							className={button()}
						>
							Expand All
						</button>
						<button
							type="button"
							onClick={() => {
								for (const details of Array.from(
									document.getElementsByTagName("details")
								)) {
									details.open = false;
								}
							}}
							className={button()}
						>
							Collapse All
						</button>

						<button
							type="button"
							onClick={() => setModal(true)}
							className={button()}
						>
							Share Your Embed
						</button>
					</div>
				</div>

				{error ? (
					<div className="px-4 py-2 rounded bg-[#d83c3e] font-semibold text-white">
						{error}
					</div>
				) : null}

				<details open>
					<summary>
						<h2>
							Author
							{authorName ? (
								<> &ndash; {ellipses(authorName)}</>
							) : null}
						</h2>
					</summary>
					<div>
						<label htmlFor="author-name">Author Name</label>
						<LimitedInput
							limit={256}
							type="text"
							id="author-name"
							value={authorName}
							onChange={e => setAuthorName(e.target.value)}
						/>
					</div>
					<div>
						<label htmlFor="author-url">Author URL</label>
						<input
							type="text"
							id="author-url"
							value={authorUrl}
							onChange={e => setAuthorUrl(e.target.value)}
						/>
					</div>
					<div>
						<label htmlFor="author-icon">Author Icon URL</label>
						<input
							type="text"
							id="author-icon"
							value={authorIcon}
							onChange={e => setAuthorIcon(e.target.value)}
						/>
					</div>
				</details>
				<details open>
					<summary>
						<h2>
							Title
							{title ? <> &ndash; {ellipses(title)}</> : null}
						</h2>
					</summary>
					<div>
						<label htmlFor="title">Title</label>
						<LimitedInput
							limit={256}
							type="text"
							id="title"
							value={title}
							onChange={e => setTitle(e.target.value)}
						/>
					</div>
					<div>
						<label htmlFor="url">Title URL</label>
						<input
							type="text"
							id="url"
							value={url}
							onChange={e => setUrl(e.target.value)}
						/>
					</div>
				</details>
				<details open>
					<summary>
						<h2>
							Description
							{description ? (
								<> &ndash; {ellipses(description)}</>
							) : null}
						</h2>
					</summary>
					<div>
						<label htmlFor="description">Description</label>
						<LimitedInput
							limit={4096}
							textarea={true}
							id="description"
							value={description}
							onChange={e => setDescription(e.target.value)}
						/>
					</div>
				</details>
				<details open className="fields">
					<summary>
						<h2>Fields &ndash; {fields.length}</h2>
					</summary>
					{fields.map((field, index) => (
						<details key={index}>
							<summary>
								<h3 className="text-white font-semibold mr-auto">
									Field {index + 1} &ndash;{" "}
									{ellipses(field.name)}
								</h3>
								{index !== 0 ? (
									<button
										onClick={() => {
											const newFields = [...fields];
											[
												newFields[index - 1],
												newFields[index]
											] = [
												newFields[index],
												newFields[index - 1]
											];
											setFields(newFields);
										}}
										className={button()}
									>
										Move Up
									</button>
								) : null}
								{index !== fields.length - 1 ? (
									<button
										onClick={() => {
											const newFields = [...fields];
											[
												newFields[index + 1],
												newFields[index]
											] = [
												newFields[index],
												newFields[index + 1]
											];
											setFields(newFields);
										}}
										className={button()}
									>
										Move Down
									</button>
								) : null}
								<button
									onClick={() => {
										setFields(
											fields.filter((_, i) => i !== index)
										);
									}}
									className={button("red")}
								>
									Delete
								</button>
							</summary>
							<div>
								<label htmlFor={`field-name-${index}`}>
									Name
								</label>
								<LimitedInput
									limit={256}
									required={true}
									type="text"
									id={`field-name-${index}`}
									value={field.name}
									onChange={e => {
										const newFields = [...fields];
										newFields[index].name = e.target.value;
										setFields(newFields);
									}}
								/>
							</div>
							<div>
								<label htmlFor={`field-value-${index}`}>
									Value
								</label>
								<LimitedInput
									limit={1024}
									required={true}
									textarea={true}
									id={`field-value-${index}`}
									value={field.value}
									onChange={e => {
										const newFields = [...fields];
										newFields[index].value = e.target.value;
										setFields(newFields);
									}}
								/>
							</div>
							<div>
								<label htmlFor={`field-inline-${index}`}>
									Inline
								</label>
								<input
									type="checkbox"
									id={`field-inline-${index}`}
									checked={field.inline}
									onChange={e => {
										const newFields = [...fields];
										newFields[index].inline =
											e.target.checked;
										setFields(newFields);
									}}
								/>
							</div>
						</details>
					))}
					<button
						type="button"
						onClick={() => {
							if (fields.length < 25)
								setFields([
									...fields,
									{
										name: "A New Field",
										value: "",
										inline: false
									}
								]);
						}}
						className={`mt-4 ${button(
							fields.length < 25 ? "blue" : "disabled"
						)}`}
					>
						Add Field
					</button>
				</details>
				<details open>
					<summary>
						<h2>Images</h2>
					</summary>
					<div>
						<label htmlFor="image">Image URL</label>
						<input
							type="text"
							id="image"
							value={image}
							onChange={e => setImage(e.target.value)}
						/>
					</div>
					<div>
						<label htmlFor="thumbnail">Thumbnail URL</label>
						<input
							type="text"
							id="thumbnail"
							value={thumbnail}
							onChange={e => setThumbnail(e.target.value)}
						/>
					</div>
				</details>
				<details open>
					<summary>
						<h2>Color</h2>
					</summary>
					<div>
						<label htmlFor="color">Color</label>
						<input
							type="color"
							id="color"
							value={color}
							onChange={e => setColor(e.target.value)}
						/>
					</div>
				</details>
				<details open>
					<summary>
						<h2>
							Footer
							{footerText ? (
								<> &ndash; {ellipses(footerText)}</>
							) : null}
						</h2>
					</summary>
					<div>
						<label htmlFor="footer-text">Footer Text</label>
						<LimitedInput
							limit={2048}
							type="text"
							id="footer-text"
							value={footerText}
							onChange={e => setFooterText(e.target.value)}
						/>
					</div>
					<div>
						<label htmlFor="footer-icon">Footer Icon</label>
						<input
							type="text"
							id="footer-icon"
							value={footerIcon}
							onChange={e => setFooterIcon(e.target.value)}
						/>
					</div>
					<div>
						<label htmlFor="timestamp">Timestamp</label>
						<input
							type="checkbox"
							id="timestamp"
							checked={!!timestamp}
							onChange={e =>
								setTimestamp(
									e.target.checked ? Date.now() : undefined
								)
							}
						/>
					</div>
				</details>
			</div>
			<div className="flex-1 bg-[#36393f] p-8">
				<DiscordEmbed embed={embed} />

				<Output embed={embed} />
			</div>
			{modal ? (
				<>
					<div
						className="fixed top-0 left-0 right-0 bottom-0 bg-black opacity-50"
						onClick={() => setModal(false)}
					/>

					<div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#292b2f] p-4 rounded">
						<h2 className="text-white text-xl font-semibold">
							Share Your Embed
						</h2>

						<p className="mb-2">
							Click the button below to copy a link to share your
							embed.
						</p>

						<Copier
							getContent={() =>
								`${location.origin}/?save=${encodeURIComponent(
									btoa(JSON.stringify(embed))
								)}`
							}
							className={button()}
							copiedClassName={button("disabled")}
						>
							Copy Permanent Link
						</Copier>
					</div>
				</>
			) : null}
		</div>
	);
}
