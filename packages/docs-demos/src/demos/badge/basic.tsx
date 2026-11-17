import { Badge } from "@codeui/kit";

export default function BadgeBasic() {
	return (
		<>
			<Badge>Draft</Badge>
			<Badge tone="success">Exported</Badge>
			<Badge tone="danger" variant="outline">
				Failed
			</Badge>
		</>
	);
}
