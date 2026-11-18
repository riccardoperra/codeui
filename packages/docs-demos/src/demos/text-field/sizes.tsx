import { Stack, TextField } from "@codeui/kit";
import { For } from "solid-js";

const sizes = ["xs", "sm", "md", "lg"] as const;

export default function TextFieldSizes() {
	return (
		<Stack gap="4" style={{ width: "320px" }}>
			<For each={sizes}>
				{size => <TextField size={size} label={`Size ${size}`} placeholder="my-snippet" />}
			</For>
		</Stack>
	);
}
