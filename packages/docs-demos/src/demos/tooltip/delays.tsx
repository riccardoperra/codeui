import { Button, Tooltip } from "@codeui/kit";

export default function TooltipDelays() {
	return (
		<>
			<Tooltip content="Opens after 200ms" variant="secondary">
				<Button variant="secondary">Default delay</Button>
			</Tooltip>
			<Tooltip content="Opens at once" variant="secondary" openDelay={0}>
				<Button variant="secondary">No delay</Button>
			</Tooltip>
			<Tooltip content="Stays 300ms after you leave" variant="secondary" closeDelay={300}>
				<Button variant="secondary">Close delay</Button>
			</Tooltip>
		</>
	);
}
