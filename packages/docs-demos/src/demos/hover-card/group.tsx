import { For } from "solid-js";
import {
	HoverCard,
	HoverCardContent,
	HoverCardGroup,
	HoverCardTrigger,
	Link,
	Text,
} from "@codeui/kit";

const columns = [
	{ name: "Files", items: ["fetch-retry.ts", "hover-card.tsx", "tokens.css"] },
	{ name: "People", items: ["Ada Lovelace", "Grace Hopper", "Alan Turing"] },
];

export default function HoverCardGroups() {
	return (
		<div style={{ display: "flex", gap: "var(--cui-space-8)" }}>
			<For each={columns}>
				{column => (
					<HoverCardGroup>
						<div
							style={{
								display: "flex",
								"flex-direction": "column",
								"align-items": "flex-start",
								gap: "var(--cui-space-2)",
							}}
						>
							<Text weight="semibold">{column.name}</Text>
							<For each={column.items}>
								{item => (
									<HoverCard>
										<HoverCardTrigger as={Link} href={`#${item}`}>
											{item}
										</HoverCardTrigger>
										<HoverCardContent>
											<Text>
												{item}, from the {column.name.toLowerCase()} group.
											</Text>
										</HoverCardContent>
									</HoverCard>
								)}
							</For>
						</div>
					</HoverCardGroup>
				)}
			</For>
		</div>
	);
}
