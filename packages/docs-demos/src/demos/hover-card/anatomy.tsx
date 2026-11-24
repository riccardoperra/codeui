import { createSignal } from "solid-js";
import { HoverCard, HoverCardContent, HoverCardTrigger, Link, Text } from "@codeui/kit";

/** Open, with the card rendered under the trigger instead of on document.body. */
export default function HoverCardAnatomy() {
	const [content, setContent] = createSignal<HTMLElement>();
	return (
		<div style={{ display: "grid", gap: "var(--cui-space-2)", "justify-items": "center" }}>
			<HoverCard open>
				<HoverCardTrigger as={Link} href="#fetch-retry">
					fetch-retry.ts
				</HoverCardTrigger>
				<HoverCardContent mount={content()}>
					<Text weight="semibold">fetch-retry.ts</Text>
					<Text tone="muted">TypeScript, edited 2 hours ago</Text>
				</HoverCardContent>
			</HoverCard>
			<div ref={setContent} />
		</div>
	);
}
