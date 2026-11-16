import { Button, Tooltip } from "@codeui/kit";

export default function TooltipDemo() {
	return (
		<>
			<Tooltip content="Copy the snippet to the clipboard">
				<Button theme="primary">Copy</Button>
			</Tooltip>
			<Tooltip content="Download as PNG" theme="secondary" placement="bottom">
				<Button theme="secondary">Export</Button>
			</Tooltip>
		</>
	);
}
