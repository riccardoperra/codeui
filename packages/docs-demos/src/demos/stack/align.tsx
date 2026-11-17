import { Badge, Stack, Text, tokens } from "@codeui/kit";
import { For } from "solid-js";

const aligns = ["start", "center", "end", "stretch", "baseline"] as const;

export default function StackAlign() {
	return (
		<Stack gap="3">
			<For each={aligns}>
				{align => (
					<Stack gap="1">
						<Text size="xs" tone="muted">
							align="{align}"
						</Text>
						<Stack
							direction="row"
							gap="3"
							align={align}
							style={{ background: tokens.surface.input, padding: tokens.space["2"], "border-radius": tokens.radius.sm }}
						>
							<Text size="xl" weight="semibold">
								main.rs
							</Text>
							<Text size="xs" tone="muted">
								Rust · 42 lines
							</Text>
							<Badge>Draft</Badge>
						</Stack>
					</Stack>
				)}
			</For>
		</Stack>
	);
}
