import { Text, tokens } from "@codeui/kit";

export default function InlineStyle() {
	return (
		<div
			style={{
				padding: tokens.space["3"],
				"border-radius": tokens.radius.card,
				background: tokens.surface.input,
			}}
		>
			<Text size="caption" tone="muted">
				{tokens.surface.input}
			</Text>
		</div>
	);
}
