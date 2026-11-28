import { For } from "solid-js";
import { HoverCard, HoverCardContent, HoverCardTrigger, Link, Text } from "@codeui/kit";

const threads = [
	{
		id: "fix-flaky",
		title: "Fix flaky hydration test",
		detail: "Codex · 2 hours ago · 3 subagents",
	},
	{ id: "port-popover", title: "Port Popover to Solid 2", detail: "Claude · yesterday" },
	{
		id: "docs-demos",
		title: "Update the docs demos",
		detail:
			"Codex · 3 days ago · waiting for review. Checks every story in dark and light.",
	},
];

export default function HoverCardShared() {
	return (
		<div
			style={{ display: "flex", "flex-direction": "column", gap: "var(--cui-space-2)" }}
		>
			<For each={threads}>
				{thread => (
					<HoverCard>
						<HoverCardTrigger as={Link} href={`#${thread.id}`}>
							{thread.title}
						</HoverCardTrigger>
						<HoverCardContent>
							<Text weight="semibold">{thread.title}</Text>
							<Text tone="muted">{thread.detail}</Text>
						</HoverCardContent>
					</HoverCard>
				)}
			</For>
		</div>
	);
}
