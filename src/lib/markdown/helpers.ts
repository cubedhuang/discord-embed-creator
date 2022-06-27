import { toASCII } from "punycode";

import {
	ParseFunction,
	ParserRule,
	ReactOutputRule,
	SingleASTNode,
	outputFor,
	parserFor
} from "simple-markdown";

export type MarkdownRule = ParserRule & ReactOutputRule;

export function depunycodeUrl(link: string) {
	try {
		const url = new URL(link);
		const { hostname, protocol } = url;

		if (protocol?.toLowerCase() === "file:") return;
		if (!hostname) return;

		url.hostname = toASCII(hostname);

		return url.toString();
	} catch {
		// return nothing
	}
}

const LTR_CHARS = [
	"A-Z",
	"a-z",
	"\u00c0-\u00d6",
	"\u00d8-\u00f6",
	"\u00f8-\u02b8",
	"\u0300-\u0590",
	"\u0800-\u1fff",
	"\u200e-\ufb1c",
	"\ufe00-\ufe6f",
	"\ufefd-\uffff"
].join("");

const RTL_CHARS = ["\u0591-\u07ff", "\ufb1d-\ufdfd", "\ufe70-\ufefc"].join("");

const LTR_RE = new RegExp(`^[^${RTL_CHARS}]*[${LTR_CHARS}]`);
const RTL_RE = new RegExp(`^[^${LTR_CHARS}]*[${RTL_CHARS}]`);

export function getTextDirection(text: string) {
	if (LTR_RE.test(text)) return "ltr";
	if (RTL_RE.test(text)) return "rtl";
	return "neutral";
}

export const parseUrl: ParseFunction = capture => {
	const [, content] = capture;

	const url = depunycodeUrl(content);

	if (!url) {
		return {
			type: "text",
			content
		};
	}

	return {
		content: [{ type: "text", content: url }],
		target: url
	};
};

export function createParser(
	rules: Record<string, MarkdownRule>,
	transform?: (ast: SingleASTNode[]) => SingleASTNode[]
) {
	const parse = parserFor(rules, { inline: true });
	const output = outputFor(rules, "react");

	return (content: string) => {
		let ast = parse(content);

		if (transform) {
			ast = transform(ast);
		}

		return output(ast);
	};
}
