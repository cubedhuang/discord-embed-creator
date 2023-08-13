import { Light } from "react-syntax-highlighter";
import js from "react-syntax-highlighter/dist/cjs/languages/hljs/javascript";
import py from "react-syntax-highlighter/dist/cjs/languages/hljs/python";
import rs from "react-syntax-highlighter/dist/cjs/languages/hljs/rust";
import { atomOneDark } from "react-syntax-highlighter/dist/cjs/styles/hljs";

Light.registerLanguage("js", js);
Light.registerLanguage("py", py);
Light.registerLanguage("rs", rs);

export default function Highlight({
	children,
	language,
	...props
}: Omit<
	React.DetailedHTMLProps<
		React.HTMLAttributes<HTMLPreElement>,
		HTMLPreElement
	>,
	"style" | "ref"
> & {
	children: string;
	language: "js" | "py" | "rs";
}) {
	return (
		<Light language={language} style={atomOneDark} wrapLongLines {...props}>
			{children}
		</Light>
	);
}
