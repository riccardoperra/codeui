import { Kbd, Stack } from "@codeui/kit";

export default function KbdVariant() {
	return (
		<Stack direction="row" gap="6" align="center">
			<Stack direction="row" gap="1" align="center">
				<Kbd variant="keycap">⇧</Kbd>
				<Kbd variant="keycap">⌘</Kbd>
				<Kbd variant="keycap">E</Kbd>
			</Stack>
			<Stack direction="row" gap="1" align="center">
				<Kbd variant="hint">⇧</Kbd>
				<Kbd variant="hint">⌘</Kbd>
				<Kbd variant="hint">E</Kbd>
			</Stack>
		</Stack>
	);
}
