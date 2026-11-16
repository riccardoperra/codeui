import { Badge, Stack } from "@codeui/kit";

export default function Demo() {
	return (
		<Stack direction="row" gap="2">
			<Badge tone="neutral">Draft</Badge>
			<Badge tone="info">New</Badge>
			<Badge tone="success">Exported</Badge>
			<Badge tone="warning">Unsaved</Badge>
			<Badge tone="danger">Failed</Badge>
		</Stack>
	);
}
