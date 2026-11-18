import { Stack, TextArea } from "@codeui/kit";
import { For } from "solid-js";

const sizes = ["xs", "sm", "md", "lg"] as const;

export default function TextAreaSizes() {
	return (
		<Stack gap="4" style={{ width: "360px" }}>
			<For each={sizes}>
				{size => <TextArea size={size} label={`Size ${size}`} placeholder="Add a caption" />}
			</For>
		</Stack>
	);
}
