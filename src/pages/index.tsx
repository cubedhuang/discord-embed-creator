import { useState } from "react";

import DiscordEmbed from "../components/DiscordEmbed";
import LimitedInput from "../components/LimitedInput";
import type { Embed } from "../lib/interfaces";
import { embedToJson } from "../lib/utils";

export default function Home() {
	const [authorIcon, setAuthorIcon] = useState("");
	const [authorName, setAuthorName] = useState("This is the author!");
	const [authorUrl, setAuthorUrl] = useState("https://example.com");

	const [title, setTitle] = useState("This is the title!");
	const [url, setUrl] = useState("https://example.com");

	const [description, setDescription] = useState("This is the description!");

	const [fields, setFields] = useState([
		{
			name: "Field 1",
			value: "This is the field value!",
			inline: false
		},
		{
			name: "Field 2",
			value: "This field is inline!",
			inline: true
		},
		{
			name: "Field 3",
			value: "Because both of these fields are inline, they will be stacked next to each other.",
			inline: true
		}
	]);

	const [image, setImage] = useState(
		"https://cubedhuang.com/images/alex-knight-unsplash.webp"
	);
	const [thumbnail, setThumbnail] = useState(
		"https://dan.onl/images/emptysong.jpg"
	);

	const [color, setColor] = useState("#202225");

	const [footerText, setFooterText] = useState("This is the footer!");
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
		thumbnail: thumbnail.trim(),
		image: image.trim(),
		color: color.trim(),
		footer: {
			text: footerText.trim(),
			iconUrl: footerIcon.trim()
		},
		timestamp
	};

	return (
		<div className="screen flex min-h-screen">
			<div className="flex-1 embed-inputs">
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
				<div className="fields">
					<h2 className="text-white font-semibold">Fields</h2>
					{fields.map((field, index) => (
						<div key={index}>
							<div>
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
										className="mr-2 font-medium py-1 px-2 rounded transition bg-[#5865f2] hover:bg-[#4752c4] text-white"
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
										className="mr-2 font-medium py-1 px-2 rounded transition bg-[#5865f2] hover:bg-[#4752c4] text-white"
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
									className="mr-2 font-medium py-1 px-2 rounded transition bg-[#d83c3e] hover:bg-[#a12d2f] text-white"
								>
									Delete
								</button>
								<h3>Field {index + 1}</h3>
							</div>
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
						</div>
					))}
					<button
						type="button"
						onClick={() => {
							if (fields.length < 25)
								setFields([
									...fields,
									{
										name: "",
										value: "",
										inline: false
									}
								]);
						}}
						className={`font-medium py-1 px-2 rounded transition ${
							fields.length < 25
								? "bg-[#5865f2] hover:bg-[#4752c4] text-white "
								: "bg-[#4f545c] cursor-not-allowed"
						}`}
					>
						Add Field
					</button>
				</div>
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
				<div>
					<label htmlFor="color">Color</label>
					<input
						type="color"
						id="color"
						value={color}
						onChange={e => setColor(e.target.value)}
					/>
				</div>
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
			</div>
			<div className="flex-1 bg-[#36393f] p-8">
				<DiscordEmbed embed={embed} />

				<div className="mt-8">
					<h2 className="text-xl font-semibold text-white">Output</h2>

					<pre className="bg-[#292b2f] p-2 text-sm rounded whitespace-pre-wrap">
						{embedToJson(embed)}
					</pre>
				</div>
			</div>
		</div>
	);
}
