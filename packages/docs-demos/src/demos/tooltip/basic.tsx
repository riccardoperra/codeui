import { Button, Tooltip } from "@codeui/kit";

export default function TooltipBasic() {
	return (
		<Tooltip content="Copy the snippet to the clipboard" variant="secondary">
			<Button variant="secondary">Copy</Button>
		</Tooltip>
	);
}
