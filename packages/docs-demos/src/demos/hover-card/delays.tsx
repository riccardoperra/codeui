import { HoverCard, HoverCardContent, HoverCardTrigger, Link } from "@codeui/kit";

export default function HoverCardDelays() {
	return (
		<>
			<HoverCard>
				<HoverCardTrigger as={Link} href="#default-delay">
					Default delay
				</HoverCardTrigger>
				<HoverCardContent>Opens after 500ms and closes 150ms after you leave.</HoverCardContent>
			</HoverCard>
			<HoverCard openDelay={200}>
				<HoverCardTrigger as={Link} href="#short-delay">
					Short delay
				</HoverCardTrigger>
				<HoverCardContent>Opens after 200ms.</HoverCardContent>
			</HoverCard>
			<HoverCard closeDelay={600}>
				<HoverCardTrigger as={Link} href="#long-close">
					Long close delay
				</HoverCardTrigger>
				<HoverCardContent>Stays 600ms after you leave the link and the card.</HoverCardContent>
			</HoverCard>
		</>
	);
}
