import React from "react";
import { defaultRules, inlineRegex } from "simple-markdown";

import { MarkdownRule } from "../helpers";

const MENTION_RE = /^<(@!?|@&|#)\d+>|^(@(?:everyone|here))/;

const MENTION_TYPES = new Map(
	Object.entries({
		"@": "@user",
		"@!": "@user",
		"@&": "@role",
		"#": "#channel"
	})
);

export const mention: MarkdownRule = {
	order: defaultRules.text.order,
	match: inlineRegex(MENTION_RE),
	parse: capture => {
		const [, type, everyoneOrHere] = capture;

		if (everyoneOrHere) {
			return {
				content: everyoneOrHere
			};
		}

		return {
			content: MENTION_TYPES.get(type)
		};
	},
	react: (node, output, state) => (
		<span
			key={state.key}
			className="rounded-[3px] px-0.5 cursor-pointer font-medium transition-colors duration-[50ms] bg-[#5f64f2] bg-opacity-30 hover:bg-opacity-100 text-[#dee0fc] hover:text-white"
		>
			{node.content}
		</span>
	)
};
