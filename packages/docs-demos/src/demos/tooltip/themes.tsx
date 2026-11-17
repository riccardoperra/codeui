import { Button, Tooltip } from "@codeui/kit";

export default function TooltipThemes() {
	return (
		<>
			<Tooltip content="Primary tooltip" theme="primary">
				<Button theme="secondary">primary</Button>
			</Tooltip>
			<Tooltip content="Secondary tooltip" theme="secondary">
				<Button theme="secondary">secondary</Button>
			</Tooltip>
		</>
	);
}
