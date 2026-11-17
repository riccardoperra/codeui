import { Badge, Stack } from "@codeui/kit";

export default function Demo() {
	return (
		<Stack direction="row" gap="2">
			<Badge variant="soft">Draft</Badge>
			<Badge variant="outline">Draft</Badge>
		</Stack>
	);
}
