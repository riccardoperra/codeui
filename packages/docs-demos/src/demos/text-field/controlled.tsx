import { Stack, Text, TextField } from "@codeui/kit";
import { createSignal } from "solid-js";

export default function TextFieldControlled() {
	const [name, setName] = createSignal("untitled");
	return (
		<Stack gap="2" style={{ width: "320px" }}>
			<TextField label="Snippet name" value={name()} onChange={setName} />
			<Text size="xs" tone="muted">
				Exports as {name() || "untitled"}.png
			</Text>
		</Stack>
	);
}
