import { Stack, Text, type TextVariants } from "@codeui/kit";
import { For } from "solid-js";

const weights: NonNullable<TextVariants["weight"]>[] = ["normal", "medium", "semibold"];

export default function TextWeight() {
	return (
		<Stack gap="2">
			<For each={weights}>
				{weight => (
					<Stack direction="row" gap="4" align="baseline">
						<Text size="xs" tone="hint" style={{ width: "5rem" }}>
							{weight}
						</Text>
						<Text weight={weight}>Export settings</Text>
					</Stack>
				)}
			</For>
		</Stack>
	);
}
