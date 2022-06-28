import { useId } from "react";

import LimitedInput from "./LimitedInput";

export default function ValueInput({
	label,
	value: [value, setValue],
	limit,
	textarea
}: {
	label: string;
	value: [string, (value: React.SetStateAction<string>) => void];
	limit?: number;
	textarea?: boolean;
}) {
	const id = useId();

	if (limit) {
		return (
			<div>
				<label htmlFor={id}>{label}</label>
				<LimitedInput
					limit={limit!}
					id={id}
					value={value}
					onChange={e => setValue(e.target.value)}
					{...(textarea ? { textarea: true } : { type: "text" })}
				/>
			</div>
		);
	}

	return (
		<div>
			<label htmlFor={id}>{label}</label>
			<input
				type="text"
				id={id}
				value={value}
				onChange={e => setValue(e.target.value)}
			/>
		</div>
	);
}
