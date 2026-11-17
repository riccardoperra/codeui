import { Stack, Text, tokens } from "@codeui/kit";

// `tokens` holds var(--cui-…) strings. `themeVars` and `themeTokens` still
// work and point at the same variables, but new code reads `tokens`.
export default function Tokens() {
	return (
		<Stack
			gap="1"
			style={{
				background: tokens.surface.panel,
				padding: tokens.space["4"],
				"border-radius": tokens.radius.card,
			}}
		>
			<Text weight="semibold">hello-world.ts</Text>
			<Text tone="muted">{tokens.surface.panel}</Text>
		</Stack>
	);
}
