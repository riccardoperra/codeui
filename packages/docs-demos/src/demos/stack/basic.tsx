import { Button, Stack, Text } from "@codeui/kit";

export default function StackBasic() {
	return (
		<Stack gap="3">
			<Stack gap="1">
				<Text size="md" weight="semibold">
					Export snippet
				</Text>
				<Text size="xs" tone="muted">
					hello-world.ts as a 2x PNG with a transparent background.
				</Text>
			</Stack>
			<Stack direction="row" gap="2" justify="end">
				<Button variant="secondary">Cancel</Button>
				<Button variant="primary">Export</Button>
			</Stack>
		</Stack>
	);
}
