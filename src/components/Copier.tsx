import { useEffect, useState } from "react";

const enum CopierState {
	Idle,
	Loading,
	Copied,
	Error
}

export default function Copier({
	getContent,
	children,
	timeout = 2000,
	className,
	idleClassName,
	loadingClassName,
	copiedClassName,
	errorClassName
}: {
	getContent: () => string | Promise<string>;
	children?: React.ReactNode;
	timeout?: number;
	className?: string;
	idleClassName?: string;
	loadingClassName?: string;
	copiedClassName?: string;
	errorClassName?: string;
}) {
	const [state, setState] = useState(CopierState.Idle);

	useEffect(() => {
		if (state !== CopierState.Copied) return;

		const id = setTimeout(() => {
			setState(CopierState.Idle);
		}, timeout);

		return () => clearTimeout(id);
	}, [state]);

	return (
		<button
			type="button"
			onClick={async () => {
				if (state !== CopierState.Idle) return;

				const content = getContent();

				if (typeof content === "string") {
					navigator.clipboard.writeText(content);
					setState(CopierState.Copied);
					return;
				}

				setState(CopierState.Loading);
				navigator.clipboard.writeText(await content);
				setState(CopierState.Copied);
			}}
			className={`${className} ${
				state === CopierState.Idle
					? idleClassName
					: state === CopierState.Loading
					? loadingClassName
					: state === CopierState.Copied
					? copiedClassName
					: errorClassName
			}`}
		>
			{state === CopierState.Idle
				? children
				: state === CopierState.Loading
				? "Loading..."
				: state === CopierState.Copied
				? "Copied!"
				: "An error occurred."}
		</button>
	);
}
