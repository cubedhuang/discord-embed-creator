import { useState } from "react";

import DiscordEmbed from "../components/DiscordEmbed";
import LimitedInput from "../components/LimitedInput";
import Output from "../components/Output";
import type { Embed } from "../lib/interfaces";

function ellipses(str: string, max = 32) {
	return str.length > max ? `${str.slice(0, max - 3)}...` : str;
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

	const [color, setColor] = useState<string | undefined>("#202225");

	const [footerText, setFooterText] = useState("Example footer!");
	const [footerIcon, setFooterIcon] = useState(
		"https://slate.dan.onl/slate.png"
	);

	const [timestamp, setTimestamp] = useState<number | undefined>(undefined);

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
							className="font-medium py-1 px-2 rounded transition bg-[#d83c3e] hover:bg-[#a12d2f] text-white"
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
							className="font-medium py-1 px-2 rounded transition bg-[#5865f2] hover:bg-[#4752c4] text-white"
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
							className="font-medium py-1 px-2 rounded transition bg-[#5865f2] hover:bg-[#4752c4] text-white"
						>
							Collapse All
						</button>
					</div>
				</div>

				{title.length +
					description.length +
					fields.reduce(
						(acc, cur) => acc + cur.name.length + cur.value.length,
						0
					) +
					footerText.length +
					authorName.length >
				6000 ? (
					<div className="w-fit ml-auto px-4 py-2 rounded bg-[#d83c3e] font-semibold text-white">
						The total number of characters in the embed content must
						not exceed 6000!
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
										className="font-medium py-1 px-2 rounded transition bg-[#5865f2] hover:bg-[#4752c4] text-white"
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
										className="font-medium py-1 px-2 rounded transition bg-[#5865f2] hover:bg-[#4752c4] text-white"
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
									className="font-medium py-1 px-2 rounded transition bg-[#d83c3e] hover:bg-[#a12d2f] text-white"
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
						className={`mt-4 font-medium py-1 px-2 rounded transition ${
							fields.length < 25
								? "bg-[#5865f2] hover:bg-[#4752c4] text-white "
								: "bg-[#4f545c] cursor-not-allowed"
						}`}
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
		</div>
	);
}
