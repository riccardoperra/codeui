import { Stack, Text, type TextVariants } from "@codeui/kit";
import { For } from "solid-js";

const tones: { tone: NonNullable<TextVariants["tone"]>; sample: string }[] = [
	{ tone: "default", sample: "hello-world.ts" },
	{ tone: "muted", sample: "TypeScript · 42 lines" },
	{ tone: "hint", sample: "Saved 2 minutes ago" },
	{ tone: "label", sample: "Background" },
	{ tone: "danger", sample: "The export failed. Try a smaller scale." },
	{ tone: "success", sample: "Copied to the clipboard" },
];

export default function TextTone() {
	return (
		<Stack gap="2">
			<For each={tones}>
				{item => (
					<Stack direction="row" gap="4" align="baseline">
						<Text size="xs" tone="hint" style={{ width: "4rem" }}>
							{item.tone}
						</Text>
						<Text tone={item.tone}>{item.sample}</Text>
					</Stack>
				)}
			</For>
		</Stack>
	);
}
