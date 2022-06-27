import { Light } from "react-syntax-highlighter";
import js from "react-syntax-highlighter/dist/cjs/languages/hljs/javascript";
import py from "react-syntax-highlighter/dist/cjs/languages/hljs/python";
import { atomOneDark } from "react-syntax-highlighter/dist/cjs/styles/hljs";

Light.registerLanguage("js", js);
Light.registerLanguage("py", py);

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
	language: "js" | "py";
}) {
	return (
		<Light language={language} style={atomOneDark} wrapLongLines {...props}>
			{children}
		</Light>
	);
}
