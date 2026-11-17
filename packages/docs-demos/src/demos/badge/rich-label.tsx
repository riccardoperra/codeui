import { Badge, icons, Stack } from "@codeui/kit";

export default function Demo() {
	return (
		<Stack direction="row" gap="2">
			<Badge tone="success" icon={<icons.CheckIcon />}>
				Exported
			</Badge>
			<Badge textValue="3 PNG exports">
				<strong>3</strong> PNG exports
			</Badge>
		</Stack>
	);
}
