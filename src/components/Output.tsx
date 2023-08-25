import { useState } from "react";

import type { Embed } from "../lib/interfaces";
import { embedToObjectCode } from "../lib/utils";
import Highlight from "./Highlight";

function s(strings: TemplateStringsArray, ...values: unknown[]) {
	let escaped = "";

	for (let i = 0; i < strings.length; i++) {
		if (i > 0) {
			escaped += JSON.stringify(`${values[i - 1]}`);
		}
		escaped += strings[i];
	}

	return escaped;
}

export default function Output({ embed }: { embed: Embed }) {
	const [language, setLanguage] = useState<"json" | "js" | "py" | "rs">("js");
	const [jsVersion, setJsVersion] = useState("14");
	const [jsMode, setJsMode] = useState("chained");
	const [rsMode, setRsMode] = useState("variable"); // variable or closure
	const [rsFields, setRsFields] = useState("together"); // together or separate

	let output = "";

	if (language === "json") {
		output = embedToObjectCode(embed, false);
	} else if (language === "js") {
		if (jsMode !== "object") {
			output += `const embed = new ${
				jsVersion === "13" ? "MessageEmbed" : "EmbedBuilder"
			}()`;

			const steps = [""];

			if (embed.author.name || embed.author.url || embed.author.iconUrl) {
				const substeps = [".setAuthor({"];

				if (embed.author.name)
					substeps.push(s`  name: ${embed.author.name},`);
				if (embed.author.url)
					substeps.push(s`  url: ${embed.author.url},`);
				if (embed.author.iconUrl)
					substeps.push(s`  iconURL: ${embed.author.iconUrl},`);
				substeps.push(`})`);

				steps.push(substeps.join(jsMode === "chained" ? "\n  " : "\n"));
			}

			if (embed.title) steps.push(s`.setTitle(${embed.title})`);

			if (embed.url) steps.push(s`.setURL(${embed.url})`);

			if (embed.description)
				steps.push(s`.setDescription(${embed.description})`);

			if (embed.fields.length > 0) {
				const substeps = [".addFields("];

				for (const field of embed.fields) {
					substeps.push(`  {`);
					substeps.push(s`    name: ${field.name},`);
					substeps.push(s`    value: ${field.value},`);
					if (field.inline) substeps.push(`    inline: true`);
					else substeps.push(`    inline: false`);
					substeps.push(`  },`);
				}
				substeps.push(`)`);

				steps.push(substeps.join(jsMode === "chained" ? "\n  " : "\n"));
			}

			if (embed.image) steps.push(s`.setImage(${embed.image})`);

			if (embed.thumbnail)
				steps.push(s`.setThumbnail(${embed.thumbnail})`);

			if (embed.color) steps.push(s`.setColor(${embed.color})`);

			if (embed.footer.text || embed.footer.iconUrl) {
				const substeps = [".setFooter({"];

				if (embed.footer.text)
					substeps.push(s`  text: ${embed.footer.text},`);
				if (embed.footer.iconUrl)
					substeps.push(s`  iconURL: ${embed.footer.iconUrl},`);
				substeps.push(`})`);

				steps.push(substeps.join(jsMode === "chained" ? "\n  " : "\n"));
			}

			if (embed.timestamp) steps.push(`.setTimestamp()`);

			output += steps.join(jsMode === "chained" ? "\n  " : ";\nembed");

			output += `;\n\nawait message.reply({ embeds: [embed] });`;
		} else {
			output += `await message.reply({\n`;
			output += `  embeds: [${embedToObjectCode(embed).replaceAll(
				"\n",
				"\n  "
			)}]\n`;
			output += `});\n`;
		}
	} else if (language === "py") {
		output += `embed = discord.Embed(`;

		const kwargs = [];

		if (embed.title) kwargs.push(s`title=${embed.title}`);
		if (embed.url) kwargs.push(s`url=${embed.url}`);
		if (embed.description) kwargs.push(s`description=${embed.description}`);
		if (embed.color)
			kwargs.push(`colour=${embed.color.replace("#", "0x")}`);
		if (embed.timestamp) kwargs.push(`timestamp=datetime.now()`);

		output += `${kwargs.join(",\n                      ")})\n`;

		if (embed.author.name || embed.author.url || embed.author.iconUrl) {
			output += `\nembed.set_author(`;

			const kwargs = [];

			if (embed.author.name) kwargs.push(s`name=${embed.author.name}`);
			if (embed.author.url) kwargs.push(s`url=${embed.author.url}`);
			if (embed.author.iconUrl)
				kwargs.push(s`icon_url=${embed.author.iconUrl}`);

			output += `${kwargs.join(`,\n                 `)})\n`;
		}

		if (embed.fields.length > 0) {
			for (const field of embed.fields) {
				output += s`\nembed.add_field(name=${field.name},\n`;
				output += s`                value=${field.value}`;
				if (field.inline) output += `,\n                inline=True`;
				else output += `,\n                inline=False`;
				output += ")";
			}
			output += "\n";
		}

		if (embed.image) output += s`\nembed.set_image(url=${embed.image})\n`;

		if (embed.thumbnail)
			output += s`\nembed.set_thumbnail(url=${embed.thumbnail})\n`;

		if (embed.footer.text || embed.footer.iconUrl) {
			output += `\nembed.set_footer(`;

			if (embed.footer.text) output += s`text=${embed.footer.text}`;
			if (embed.footer.iconUrl) {
				if (embed.footer.text) output += `,\n                 `;
				output += s`icon_url=${embed.footer.iconUrl}`;
			}
			output += `)\n`;
		}

		output += `\nawait ctx.send(embed=embed)`;
	} else if (language === "rs") {
		output =
			"// You may need to import additional things to make this work\n\n";

		output +=
			rsMode === "variable"
				? `let embed = CreateEmbed::default()`
				: "let msg = msg\n    .channel_id\n    .send_message(&ctx.http, |m| {\n        m.embed(|e| {\n            e";

		const steps = rsMode === "variable" ? [""] : [];

		const substepsSeparator =
			rsMode === "variable" ? "\n        " : "\n                    ";

		if (embed.title) steps.push(s`.title(${embed.title})`);
		if (embed.url) steps.push(s`.url(${embed.url})`);
		if (embed.description)
			steps.push(s`.description(${embed.description})`);
		if (embed.color)
			steps.push(
				`.color(Colour::new(${embed.color.replace("#", "0x")}))`
			);
		if (embed.timestamp) steps.push(`.timestamp(Timestamp::now())`);

		if (embed.author.name || embed.author.url || embed.author.iconUrl) {
			const first = `.author(|a| {${substepsSeparator}a`;
			const substeps = [];

			if (embed.author.name)
				substeps.push(s`.name(${embed.author.name})`);
			if (embed.author.url) substeps.push(s`.url(${embed.author.url})`);
			if (embed.author.iconUrl)
				substeps.push(s`.icon_url(${embed.author.iconUrl})`);

			steps.push(first + substeps.join(substepsSeparator + "    "), `})`);
		}

		if (embed.fields.length > 0) {
			if (rsFields === "together") {
				const substeps = [`.fields(vec![`];

				for (const field of embed.fields) {
					substeps.push(
						s`(${field.name}, ${field.value}, ${field.inline}),`
					);
				}

				steps.push(substeps.join(substepsSeparator), `])`);
			} else {
				for (const field of embed.fields) {
					steps.push(
						s`.field(${field.name}, ${field.value}, ${field.inline})`
					);
				}
			}
		}

		if (embed.image) steps.push(s`.image(${embed.image})`);

		if (embed.thumbnail) steps.push(s`.thumbnail(${embed.thumbnail})`);

		if (embed.footer.text || embed.footer.iconUrl) {
			const first = `.footer(|f| {${substepsSeparator}f`;
			const substeps = [];

			if (embed.footer.text)
				substeps.push(s`.text(${embed.footer.text})`);
			if (embed.footer.iconUrl)
				substeps.push(s`.icon_url(${embed.footer.iconUrl})`);

			steps.push(first + substeps.join(substepsSeparator + "    "), `})`);
		}

		output += steps.join(
			rsMode === "variable" ? "\n    " : "\n                "
		);

		if (rsMode === "closure") {
			output += `\n        })\n    })\n    .await;`;
		} else {
			output += `;\n\nlet msg = msg\n    .channel_id\n    .send_message(&ctx.http, |m| m.set_embed(embed))\n    .await;`;
		}
	}

	return (
		<div className="mt-8">
			<h2 className="text-xl font-semibold text-white">Output</h2>

			<div className="flex my-2 gap-2">
				<select
					name="language"
					id="language"
					value={language}
					onChange={e => setLanguage(e.target.value as "js" | "py")}
				>
					<option value="json">JSON representation</option>
					<option value="js">discord.js</option>
					<option value="py">discord.py</option>
					<option value="rs">serenity (rust)</option>
				</select>

				{language === "js" ? (
					<>
						<select
							name="version"
							id="version"
							value={jsVersion}
							onChange={e => setJsVersion(e.target.value)}
						>
							<option value="13">v13</option>
							<option value="14">v14</option>
						</select>

						<select
							name="mode"
							id="mode"
							value={jsMode}
							onChange={e => setJsMode(e.target.value)}
						>
							<option value="chained">Builder (Chained)</option>
							<option value="split">Builder (Split)</option>
							<option value="object">Object</option>
						</select>
					</>
				) : null}

				{language === "rs" ? (
					<>
						<select
							name="mode"
							id="mode"
							value={rsMode}
							onChange={e => setRsMode(e.target.value)}
						>
							<option value="variable">Separate Variable</option>
							<option value="closure">In a Closure</option>
						</select>

						<select
							name="fields"
							id="fields"
							value={rsFields}
							onChange={e => setRsFields(e.target.value)}
						>
							<option value="together">Fields Together</option>
							<option value="separate">Fields Separate</option>
						</select>
					</>
				) : null}
			</div>

			<Highlight
				language={language === "json" ? "js" : language}
				className="rounded text-sm"
			>
				{output}
			</Highlight>
		</div>
	);
}
