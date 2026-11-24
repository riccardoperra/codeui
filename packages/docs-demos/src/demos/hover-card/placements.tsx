import { For } from "solid-js";
import { HoverCard, HoverCardContent, HoverCardTrigger, Link } from "@codeui/kit";

const placements = ["top-start", "right-start", "bottom-start", "left-start"] as const;

export default function HoverCardPlacements() {
	return (
		<For each={placements}>
			{placement => (
				<HoverCard placement={placement}>
					<HoverCardTrigger as={Link} href={`#${placement}`}>
						{placement}
					</HoverCardTrigger>
					<HoverCardContent>The card opens on this side of the link.</HoverCardContent>
				</HoverCard>
			)}
		</For>
	);
}
