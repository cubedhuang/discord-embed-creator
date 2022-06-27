import { anyScopeRegex, defaultRules } from "simple-markdown";

import { MarkdownRule } from "../helpers";

const CODE_BLOCK_RE = /^```(?:([\w+.-]+?)\n)?\n*([^\n][\S\s]*?)\n*```/i;

export const codeBlock: MarkdownRule = {
	order: defaultRules.codeBlock.order,
	match: anyScopeRegex(CODE_BLOCK_RE),
	parse: capture => {
		const [, , content] = capture;

		return {
			content
		};
	},
	react: (node, output, state) => {
		return (
			<pre
				key={state.key}
				className="max-w-full bg-[#202225] text-[##b9bbbe] rounded mt-[.375rem] p-2 text-sm leading-[1.125rem] whitespace-pre-wrap"
			>
				{node.content}
			</pre>
		);
	}
};
