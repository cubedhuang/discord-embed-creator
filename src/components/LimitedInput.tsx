export default function LimitedInput({
	limit,
	textarea = false,
	required = false,
	...props
}: React.DetailedHTMLProps<
	React.InputHTMLAttributes<HTMLInputElement>,
	HTMLInputElement
> & { limit: number; textarea?: boolean; required?: boolean }) {
	const Element: keyof JSX.IntrinsicElements = textarea
		? "textarea"
		: "input";

	return (
		<div className="limited-input relative">
			{/* @ts-expect-error */}
			<Element
				{...props}
				style={
					typeof props.value === "string" &&
					(props.value.length > limit || (required && !props.value))
						? { ...props.style, borderColor: "#df4549" }
						: props.style
				}
			/>
			{typeof props.value === "string" &&
			props.value.length > limit * 0.8 ? (
				<span
					className={`absolute pointer-events-none text-xs right-0 ${
						textarea ? "-bottom-2" : "-bottom-3"
					}`}
				>
					{typeof props.value === "string" && props.value.length}/
					{limit}
				</span>
			) : required && typeof props.value === "string" && !props.value ? (
				<span
					className={`absolute pointer-events-none text-xs right-1 ${
						textarea ? "bottom-3" : "bottom-1"
					}`}
				>
					This field is required.
				</span>
			) : null}
		</div>
	);
}
