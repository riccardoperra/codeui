import { Stack, Text } from "@codeui/kit";

export default function TextTruncate() {
	return (
		<Stack direction="row" gap="4" align="baseline" style={{ "max-width": "18rem" }}>
			<Text weight="medium" style={{ "flex-shrink": "0" }}>
				Path
			</Text>
			<Text
				tone="muted"
				style={{ overflow: "hidden", "text-overflow": "ellipsis", "white-space": "nowrap", "min-width": "0" }}
			>
				src/components/editor/frame/export-settings-panel.tsx
			</Text>
		</Stack>
	);
}
