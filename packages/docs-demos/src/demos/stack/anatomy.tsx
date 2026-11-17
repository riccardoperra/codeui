import { Badge, Stack, Text } from "@codeui/kit";

export default function StackAnatomy() {
	return (
		<Stack direction="row" gap="3" align="center">
			<Text weight="semibold">main.rs</Text>
			<Text size="xs" tone="muted">
				Rust · 42 lines
			</Text>
			<Badge>Draft</Badge>
		</Stack>
	);
}
