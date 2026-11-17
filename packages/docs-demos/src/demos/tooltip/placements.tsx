import { For } from "solid-js";
import { Button, Tooltip } from "@codeui/kit";

const placements = ["top", "right", "bottom", "left", "top-start", "bottom-end"] as const;

export default function TooltipPlacements() {
	return (
		<For each={placements}>
			{placement => (
				<Tooltip content={`Opens on ${placement}`} placement={placement}>
					<Button theme="secondary" size="sm">
						{placement}
					</Button>
				</Tooltip>
			)}
		</For>
	);
}
