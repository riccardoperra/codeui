import { Badge, Stack, Text } from "@codeui/kit";

export default function StackDirection() {
	return (
		<Stack direction="row" gap="8" wrap>
			<Stack gap="2">
				<Text size="xs" tone="muted">
					direction="column" (default)
				</Text>
				<Badge>PNG</Badge>
				<Badge>SVG</Badge>
				<Badge>JPEG</Badge>
			</Stack>
			<Stack gap="2">
				<Text size="xs" tone="muted">
					direction="row"
				</Text>
				<Stack direction="row" gap="2">
					<Badge>PNG</Badge>
					<Badge>SVG</Badge>
					<Badge>JPEG</Badge>
				</Stack>
			</Stack>
		</Stack>
	);
}
