import { For } from "solid-js";
import { Button, Popover, PopoverContent, PopoverTrigger } from "@codeui/kit";

const placements = [
	"top-start",
	"top-end",
	"right-start",
	"right-end",
	"bottom-start",
	"bottom-end",
	"left-start",
	"left-end",
] as const;

export default function PopoverPlacements() {
	return (
		<For each={placements}>
			{placement => (
				<Popover placement={placement}>
					<PopoverTrigger as={Button} theme="secondary" size="sm">
						{placement}
					</PopoverTrigger>
					<PopoverContent title={placement}>The panel opens on this side of the trigger.</PopoverContent>
				</Popover>
			)}
		</For>
	);
}
