import { Button, Tooltip } from "@codeui/kit";

export default function TooltipThemes() {
	return (
		<>
			<Tooltip content="Primary tooltip" variant="primary">
				<Button variant="secondary">primary</Button>
			</Tooltip>
			<Tooltip content="Secondary tooltip" variant="secondary">
				<Button variant="secondary">secondary</Button>
			</Tooltip>
		</>
	);
}
