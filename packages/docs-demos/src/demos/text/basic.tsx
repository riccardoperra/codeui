import { Stack, Text } from "@codeui/kit";

export default function TextBasic() {
	return (
		<Stack gap="1">
			<Text as="h3" size="md" weight="semibold">
				Export settings
			</Text>
			<Text tone="muted">Choose the format and scale for hello-world.ts.</Text>
			<Text size="xs" tone="hint">
				Saved 2 minutes ago
			</Text>
		</Stack>
	);
}
