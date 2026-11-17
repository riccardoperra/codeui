import { Badge, stackStyles } from "@codeui/kit";

export default function StackStylesDemo() {
	return (
		<ul
			class={stackStyles.root({ direction: "row", align: "center", gap: "2" })}
			style={{ margin: "0", padding: "0", "list-style": "none" }}
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
