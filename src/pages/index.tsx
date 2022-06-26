import { useState } from "react";

import DiscordEmbed from "../components/DiscordEmbed";

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

	const [color, setColor] = useState("#00b0f4");

	const [footerText, setFooterText] = useState("This is the footer!");
	const [footerIcon, setFooterIcon] = useState(
		"https://slate.dan.onl/slate.png"
	);

	const [timestamp, setTimestamp] = useState<number | undefined>(undefined);

	return (
		<div className="screen flex min-h-screen">
			<div className="flex-1 embed-inputs">
				<div>
					<label htmlFor="author-name">Author Name</label>
					<input
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
					<input
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
					<textarea
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
								<label htmlFor={`field-name-${index}`}>
									Name
								</label>
								<input
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
								<textarea
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
							setFields([
								...fields,
								{
									name: "",
									value: "",
									inline: false
								}
							]);
						}}
						className=""
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
					<input
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
				<DiscordEmbed
					embed={{
						author: {
							name: authorName,
							iconUrl: authorIcon,
							url: authorUrl
						},
						title,
						url,
						description,
						fields,
						thumbnail,
						image,
						color,
						footer: {
							text: footerText,
							iconUrl: footerIcon
						},
						timestamp
					}}
				/>
			</div>
		</div>
	);
}
