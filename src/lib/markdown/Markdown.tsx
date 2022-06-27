import { parsers } from "./parsers";

export default function Markdown({
	className,
	children,
	type = "content"
}: {
	className?: string;
	children: string;
	type?: keyof typeof parsers;
}) {
	const parse = parsers[type];

	return (
		<div
			className={`whitespace-pre-wrap break-words leading-snug ${className}`}
		>
			{parse(children.trim())}
		</div>
	);
}
