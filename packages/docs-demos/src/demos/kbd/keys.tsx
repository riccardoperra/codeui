import { Kbd, Stack } from "@codeui/kit";
import { For } from "solid-js";

const keys = ["Esc", "Enter", "Tab", "Space", "⌫", "↑", "↓", "←", "→", "/", "?"];

export default function KbdKeys() {
	return (
		<Stack direction="row" gap="1.5" wrap>
			<For each={keys}>{key => <Kbd>{key}</Kbd>}</For>
		</Stack>
	);
}
