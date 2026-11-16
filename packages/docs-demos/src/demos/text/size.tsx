import { Stack, Text, type TextVariants } from "@codeui/kit";
import { For } from "solid-js";

const sizes: NonNullable<TextVariants["size"]>[] = ["badge", "xs", "caption", "sm", "md", "lg", "xl", "2xl"];

export default function TextSize() {
	return (
		<Stack gap="2">
			<For each={sizes}>
				{size => (
					<Stack direction="row" gap="4" align="baseline">
						<Text size="xs" tone="hint" style={{ width: "4rem" }}>
							{size}
						</Text>
						<Text size={size}>Export settings</Text>
					</Stack>
				)}
			</For>
		</Stack>
	);
}
