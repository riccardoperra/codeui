import { Button, Tooltip } from "@codeui/kit";

export default function TooltipBasic() {
	return (
		<Tooltip content="Copy the snippet to the clipboard" theme="secondary">
			<Button theme="secondary">Copy</Button>
		</Tooltip>
	);
}
