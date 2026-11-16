import { Stack, Text } from "@codeui/kit";

export default function WeightsAndTones() {
	return (
		<Stack gap="1" style={{ width: "100%", "max-width": "360px" }}>
			<Text size="sm" weight="semibold">
				Window
			</Text>
			<Text size="sm" weight="medium">
				Show line numbers
			</Text>
			<Text size="xs" tone="muted">
				Line numbers start at 1 and use tabular figures.
			</Text>
			<Text size="xs" tone="danger">
				The snippet name is required.
			</Text>
		</Stack>
	);
}
