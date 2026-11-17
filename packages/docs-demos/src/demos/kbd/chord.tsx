import { Kbd, Stack, Text } from "@codeui/kit";

export default function KbdChord() {
	return (
		<Stack gap="3">
			<Stack direction="row" gap="4" align="center" justify="between">
				<Text>Export as PNG</Text>
				<Stack as="kbd" direction="row" gap="1" align="center">
					<Kbd>⌘</Kbd>
					<Kbd>⇧</Kbd>
					<Kbd>E</Kbd>
				</Stack>
			</Stack>
			<Stack direction="row" gap="4" align="center" justify="between">
				<Text>Go to the snippet library</Text>
				<Stack direction="row" gap="1" align="center">
					<Kbd>G</Kbd>
					<Text size="xs" tone="hint">
						then
					</Text>
					<Kbd>L</Kbd>
				</Stack>
			</Stack>
		</Stack>
	);
}
