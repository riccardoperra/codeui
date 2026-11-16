import { Button, Tooltip } from "@codeui/kit";

export default function TooltipDelays() {
	return (
		<>
			<Tooltip content="Opens after 200ms" theme="secondary">
				<Button theme="secondary">Default delay</Button>
			</Tooltip>
			<Tooltip content="Opens at once" theme="secondary" openDelay={0}>
				<Button theme="secondary">No delay</Button>
			</Tooltip>
			<Tooltip content="Stays 300ms after you leave" theme="secondary" closeDelay={300}>
				<Button theme="secondary">Close delay</Button>
			</Tooltip>
		</>
	);
}
