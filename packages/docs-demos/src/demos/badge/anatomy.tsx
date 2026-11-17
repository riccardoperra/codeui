import { Badge, icons } from "@codeui/kit";

export default function BadgeAnatomy() {
	return (
		<Badge tone="success" icon={<icons.CheckIcon />}>
			Exported
		</Badge>
	);
}
