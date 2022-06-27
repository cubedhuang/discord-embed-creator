import { defaultRules } from "simple-markdown";

import { MarkdownRule, parseUrl } from "../helpers";
import { link } from "./link";

export const autolink: MarkdownRule = {
	...defaultRules.autolink,
	parse: parseUrl,
	react: link.react
};
