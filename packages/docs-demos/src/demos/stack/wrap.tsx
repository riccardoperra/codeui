import { Badge, Stack, Text } from "@codeui/kit";
import { For } from "solid-js";

const languages = ["TypeScript", "Rust", "Python", "Go", "Kotlin", "Swift", "Elixir", "Haskell", "Zig", "OCaml"];

export default function StackWrap() {
	return (
		<Stack gap="4" style={{ "max-width": "20rem" }}>
			<Stack gap="1">
				<Text size="xs" tone="muted">
					wrap
				</Text>
				<Stack direction="row" gap="1.5" wrap>
					<For each={languages}>{language => <Badge>{language}</Badge>}</For>
				</Stack>
			</Stack>
			<Stack gap="1">
				<Text size="xs" tone="muted">
					wrap={"{false}"} (default)
				</Text>
				<Stack direction="row" gap="1.5" style={{ overflow: "hidden" }}>
					<For each={languages}>{language => <Badge>{language}</Badge>}</For>
				</Stack>
			</Stack>
		</Stack>
	);
}
