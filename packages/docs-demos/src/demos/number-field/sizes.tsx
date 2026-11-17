import { NumberField, Stack } from "@codeui/kit";
import { For } from "solid-js";

const sizes = ["xs", "sm", "md", "lg", "xl"] as const;

export default function NumberFieldSizes() {
	return (
		<Stack gap="4" style={{ width: "240px" }}>
			<For each={sizes}>{size => <NumberField size={size} label={`Size ${size}`} defaultValue={14} />}</For>
		</Stack>
	);
}
