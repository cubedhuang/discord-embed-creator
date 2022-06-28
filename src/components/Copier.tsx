import { useEffect, useState } from "react";

export default function Copier({
	getContent,
	children,
	timeout = 2000,
	className,
	copiedClassName
}: {
	getContent: () => string | Promise<string>;
	children?: React.ReactNode;
	timeout?: number;
	className?: string;
	copiedClassName?: string;
}) {
	const [copied, setCopied] = useState(false);

	useEffect(() => {
		if (!copied) return;

		const id = setTimeout(() => {
			setCopied(false);
		}, timeout);

		return () => clearTimeout(id);
	}, [copied]);

	return (
		<button
			type="button"
			onClick={async () => {
				if (copied) return;
				navigator.clipboard.writeText(await getContent());
				setCopied(true);
			}}
			className={copied ? copiedClassName : className}
		>
			{copied ? "Copied!" : children}
		</button>
	);
}
