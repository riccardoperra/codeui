import { Stack, Switch, Text } from "@codeui/kit";

export default function StackSettingsRow() {
	return (
		<Stack direction="row" gap="4" align="center" justify="between">
			<Stack gap="0.5">
				<Text weight="medium">Show line numbers</Text>
				<Text size="xs" tone="muted">
					Adds a gutter to the exported image.
				</Text>
			</Stack>
			<Switch aria-label="Show line numbers" defaultChecked />
		</Stack>
	);
}
