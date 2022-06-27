import React from "react";
import { defaultRules, inlineRegex } from "simple-markdown";

import { MarkdownRule } from "../helpers";

export const spoiler: MarkdownRule = {
	order: defaultRules.text.order,
	match: inlineRegex(/^\|\|([\S\s]+?)\|\|/),
	parse: (capture, parse, state) => ({
		content: parse(capture[1], state)
	}),
	react: (node, output, state) => (
		<span key={state.key} className="bg-white bg-opacity-10 rounded-[3px]">
			{output(node.content, state)}
		</span>
	)
};
