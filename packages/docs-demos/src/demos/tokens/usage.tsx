import { Button, Text } from "@codeui/kit";

export default function TokensUsage() {
	return (
		<div
			style={{
				display: "flex",
				"align-items": "center",
				gap: "var(--cui-space-3)",
				padding: "var(--cui-space-3) var(--cui-space-4)",
				"border-radius": "var(--cui-radius-card)",
				background: "var(--cui-surface-input)",
				color: "var(--cui-text-default)",
			}}
		>
			<Text size="caption">fibonacci.ts</Text>
			<Button theme="primary" size="sm">
				Export PNG
			</Button>
		</div>
	);
}
