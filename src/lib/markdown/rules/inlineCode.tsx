import React from "react";
import { defaultRules } from "simple-markdown";

import { MarkdownRule } from "../helpers";

export const inlineCode: MarkdownRule = {
	...defaultRules.inlineCode,
	react: (node, output, state) => (
		<code
			key={state.key}
			className="p-[.2em] my-[-.2em] rounded-[3px] bg-[#202225] text-[.75rem] leading-[1.125rem] whitespace-pre-wrap"
		>
			{node.content}
		</code>
	)
};
