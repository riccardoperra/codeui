import { Badge, stackStyles, tokens } from "@codeui/kit";

export default function StackStylesDemo() {
	return (
		<ul
			class={stackStyles.root()}
			data-direction="row"
			data-align="center"
			style={{ "--cui-stack-gap": tokens.space["2"], margin: "0", padding: "0", "list-style": "none" }}
		>
			<li>
				<Badge>PNG</Badge>
			</li>
			<li>
				<Badge>SVG</Badge>
			</li>
		</ul>
	);
}
