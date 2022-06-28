import { useEffect, useState } from "react";

export default function Copier({
	getContent,
	children,
	className,
	copiedClassName
}: {
	getContent: () => string;
	children?: React.ReactNode;
	className?: string;
	copiedClassName?: string;
}) {
	const [copied, setCopied] = useState(false);

	useEffect(() => {
		if (!copied) return;

		const id = setTimeout(() => {
			setCopied(false);
		}, 2000);

		return () => clearTimeout(id);
	}, [copied]);

	return (
		<button
			type="button"
			onClick={() => {
				navigator.clipboard.writeText(getContent());
				setCopied(true);
			}}
			className={copied ? copiedClassName : className}
		>
			{copied ? "Copied!" : children}
		</button>
	);
}
