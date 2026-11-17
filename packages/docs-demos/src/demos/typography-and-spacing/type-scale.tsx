import { Stack, Text } from "@codeui/kit";
import { For } from "solid-js";

const steps = [
	{ size: "badge", weight: "medium", sample: "PNG" },
	{ size: "xs", weight: "normal", sample: "Exported 2 minutes ago" },
	{ size: "caption", weight: "normal", sample: "Padding around your code" },
	{ size: "sm", weight: "medium", sample: "Export snippet" },
	{ size: "md", weight: "semibold", sample: "Appearance" },
	{ size: "lg", weight: "semibold", sample: "What's new" },
	{ size: "xl", weight: "semibold", sample: "What's new" },
	{ size: "2xl", weight: "semibold", sample: "What's new" },
] as const;

export default function TypeScale() {
	return (
		<Stack gap="3" style={{ width: "100%", "max-width": "420px" }}>
			<For each={steps}>
				{step => (
					<Stack direction="row" gap="4" align="baseline">
						<Text size="xs" tone="hint" style={{ width: "64px", "flex-shrink": 0 }}>
							{step.size}
						</Text>
						<Text size={step.size} weight={step.weight}>
							{step.sample}
						</Text>
					</Stack>
				)}
			</For>
		</Stack>
	);
}
