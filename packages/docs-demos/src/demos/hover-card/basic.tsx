import { Badge, HoverCard, HoverCardContent, HoverCardTrigger, Link, Text } from "@codeui/kit";

export default function HoverCardBasic() {
	return (
		<Text as="p">
			Ada shared{" "}
			<HoverCard placement="bottom-start">
				<HoverCardTrigger as={Link} href="#fetch-retry">
					fetch-retry.ts
				</HoverCardTrigger>
				<HoverCardContent>
					<div style={{ display: "flex", "align-items": "center", gap: "var(--cui-space-2)" }}>
						<Text weight="semibold">fetch-retry.ts</Text>
						<Badge tone="info">Shared</Badge>
					</div>
					<Text tone="muted">TypeScript · Vitesse Dark · JetBrains Mono</Text>
					<Text>Retries a failed request three times with exponential backoff.</Text>
					<Text size="xs" tone="hint">
						Edited by Ada Lovelace 2 hours ago
					</Text>
				</HoverCardContent>
			</HoverCard>{" "}
			with the team.
		</Text>
	);
}
