import { useRouter } from "next/router";
import { useEffect, useState } from "react";

import Copier from "../components/Copier";
import DiscordEmbed from "../components/DiscordEmbed";
import LimitedInput from "../components/LimitedInput";
import Output from "../components/Output";
import ValueInput from "../components/ValueInput";
import { Embed, EmbedField } from "../lib/interfaces";

function ellipses(str: string, max = 50) {
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

function setAllDetails(open: boolean) {
	for (const details of Array.from(
		document.getElementsByTagName("details")
	)) {
		details.open = false;
	}
}

const infoEmbed: Embed = {
	author: {
		name: "Info",
		url: "https://example.com",
		iconUrl: ""
	},
	title: "Example Title",
	url: "https://example.com",
	description: `This is an example description. Markdown works too!

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
__Underline__`,
	color: "#00b0f4",
	fields: [
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
	],
	image: "https://cubedhuang.com/images/alex-knight-unsplash.webp",
	thumbnail: "https://dan.onl/images/emptysong.jpg",
	footer: {
		text: "Example Footer",
		iconUrl: "https://slate.dan.onl/slate.png"
	},
	timestamp: Date.now()
};

export default function Home() {
	const [authorIcon, setAuthorIcon] = useState("");
	const [authorName, setAuthorName] = useState("");
	const [authorUrl, setAuthorUrl] = useState("");

	const [title, setTitle] = useState("");
	const [url, setUrl] = useState("");
	const [description, setDescription] = useState("");
	const [color, setColor] = useState<string | undefined>("#202225");

	const [fields, setFields] = useState<EmbedField[]>([]);

	const [image, setImage] = useState("");
	const [thumbnail, setThumbnail] = useState("");

	const [footerText, setFooterText] = useState("");
	const [footerIcon, setFooterIcon] = useState("");
	const [timestamp, setTimestamp] = useState<number | undefined>(undefined);

	const [embedLoaded, setEmbedLoaded] = useState(false);

	const [error, setError] = useState<string | undefined>(undefined);

	const [modal, setModal] = useState(false);

	const router = useRouter();

	useEffect(() => {
		(async () => {
			if (!router.isReady) return;

			const { data, id } = router.query;

			if (!data && !id) {
				if (!embedLoaded) loadEmbed(infoEmbed);
				return;
			}

			try {
				let embed: any;

				if (id) {
					embed = await fetch(`/api/load?id=${id}`)
						.then(res => res.json())
						.then(res => res.embed);

					if (!embed) {
						throw new Error("No embed found.");
					}
				} else if (data) {
					const embedString = Array.isArray(data) ? data[0] : data;

					embed = JSON.parse(atob(embedString));
				}

				loadEmbed(embed);
			} catch (e) {
				loadEmbed(infoEmbed);
				setError("An error occurred while importing the embed!");
			} finally {
				router.push("/", "/", { shallow: true });
			}
		})();
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

	function loadEmbed(embed: Embed) {
		setAuthorIcon(embed.author?.iconUrl ?? "");
		setAuthorName(embed.author?.name ?? "");
		setAuthorUrl(embed.author?.url ?? "");

		setTitle(embed.title ?? "");
		setUrl(embed.url ?? "");
		setDescription(embed.description ?? "");

		setFields(embed.fields ?? []);

		setImage(embed.image ?? "");
		setThumbnail(embed.thumbnail ?? "");

		setColor(embed.color);

		setFooterText(embed.footer?.text ?? "");
		setFooterIcon(embed.footer?.iconUrl ?? "");

		setTimestamp(embed.timestamp);

		setEmbedLoaded(true);
	}

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
		color,
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
							target="_blank"
							rel="noopener noreferrer"
							className="hover:underline"
						>
							GitHub
						</a>
					</div>

					<div className="flex mt-2 gap-2">
						<button
							type="button"
							onClick={() => {
								setAllDetails(false);
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
								setError(undefined);
							}}
							className={button("red")}
						>
							Clear All
						</button>

						<button
							type="button"
							onClick={() => setAllDetails(true)}
							className={button()}
						>
							Expand All
						</button>
						<button
							type="button"
							onClick={() => setAllDetails(false)}
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
					<ValueInput
						label="Author Name"
						value={[authorName, setAuthorName]}
						limit={256}
					/>
					<ValueInput
						label="Author URL"
						value={[authorUrl, setAuthorUrl]}
					/>
					<ValueInput
						label="Author Icon URL"
						value={[authorIcon, setAuthorIcon]}
					/>
				</details>
				<details open>
					<summary>
						<h2>
							Body
							{title ? <> &ndash; {ellipses(title)}</> : null}
						</h2>
					</summary>
					<ValueInput
						label="Title"
						value={[title, setTitle]}
						limit={256}
					/>
					<ValueInput label="Title URL" value={[url, setUrl]} />
					<ValueInput
						label="Description"
						value={[description, setDescription]}
						limit={4096}
						textarea={true}
					/>
					<div className="flex items-center gap-2">
						<label htmlFor="color">Color</label>
						<input
							type="color"
							id="color"
							value={color}
							onChange={e => setColor(e.target.value)}
							disabled={!color}
							className="mt-2"
						/>
						<label
							htmlFor="color-enabled"
							className="text-sm text-white ml-2"
						>
							Enabled?
						</label>
						<input
							type="checkbox"
							checked={color ? true : false}
							id="color-enabled"
							value={color}
							onChange={e =>
								setColor(
									e.target.checked ? "#202225" : undefined
								)
							}
							className="mt-2"
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
								<button
									onClick={() => {
										if (index === 0) return;
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
									className={button(
										index === 0 ? "disabled" : "blue"
									)}
								>
									Move Up
								</button>
								<button
									onClick={() => {
										if (index === fields.length - 1) return;
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
									className={button(
										index === fields.length - 1
											? "disabled"
											: "blue"
									)}
								>
									Move Down
								</button>
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
							<div className="flex items-center justify-start gap-2">
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
									className="mt-2"
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
					<ValueInput label="Image URL" value={[image, setImage]} />
					<ValueInput
						label="Thumbnail URL"
						value={[thumbnail, setThumbnail]}
					/>
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
					<ValueInput
						label="Footer Text"
						value={[footerText, setFooterText]}
						limit={2048}
					/>
					<ValueInput
						label="Footer Icon URL"
						value={[footerIcon, setFooterIcon]}
					/>
					<div className="flex items-center gap-2">
						<label htmlFor="timestamp">Timestamp?</label>
						<input
							type="checkbox"
							id="timestamp"
							checked={!!timestamp}
							onChange={e =>
								setTimestamp(
									e.target.checked ? Date.now() : undefined
								)
							}
							className="mt-2"
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

						<p className="mb-1">
							The short link will be valid for one week.
						</p>

						<Copier
							getContent={async () => {
								const { id } = await fetch("/api/save", {
									body: JSON.stringify({ embed }),
									method: "POST",
									headers: {
										"Content-Type": "application/json"
									}
								}).then(res => res.json());

								return `${location.origin}/?id=${id}`;
							}}
							className={button()}
							copiedClassName={button("disabled")}
							timeout={30000}
						>
							Copy Short Link
						</Copier>

						<p className="mt-2 mb-1">
							The permanent link contains all of your embed data.
						</p>

						<Copier
							getContent={() =>
								`${location.origin}/?data=${encodeURIComponent(
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
