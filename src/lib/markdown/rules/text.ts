import { defaultRules } from "simple-markdown";

import { MarkdownRule } from "../helpers";

export const text: MarkdownRule = {
	...defaultRules.text,
	parse: (capture, parse, state) => {
		const [content] = capture;
		const { nested } = state;

		if (nested) {
			return {
				content
			};
		}

		return parse(content, {
			...state,
			nested: true
		});
	}
};
