import { Badge, Stack, Text, tokens } from "@codeui/kit";
import { For } from "solid-js";

const justifies = ["start", "center", "end", "between", "around", "evenly"] as const;

export default function StackJustify() {
	return (
		<Stack gap="3">
			<For each={justifies}>
				{justify => (
					<Stack gap="1">
						<Text size="xs" tone="muted">
							justify="{justify}"
						</Text>
						<Stack
							direction="row"
							gap="2"
							justify={justify}
							style={{ background: tokens.surface.input, padding: tokens.space["2"], "border-radius": tokens.radius.sm }}
						>
							<Badge>PNG</Badge>
							<Badge>SVG</Badge>
							<Badge>JPEG</Badge>
						</Stack>
					</Stack>
				)}
			</For>
		</Stack>
	);
}
