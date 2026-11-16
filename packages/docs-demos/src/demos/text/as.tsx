import { Stack, Text } from "@codeui/kit";

export default function TextAs() {
	return (
		<Stack gap="1">
			<Text as="h2" size="lg" weight="semibold">
				Snippet library
			</Text>
			<Text as="p" tone="muted">
				Every snippet you save in CodeImage appears here.
			</Text>
			<Text as="label" for="snippet-name" size="xs" weight="semibold" tone="label">
				Snippet name
			</Text>
		</Stack>
	);
}
