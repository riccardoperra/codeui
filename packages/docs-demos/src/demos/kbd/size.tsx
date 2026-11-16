import { Kbd, Stack } from "@codeui/kit";

export default function KbdSize() {
	return (
		<Stack direction="row" gap="6" align="center">
			<Stack direction="row" gap="1" align="center">
				<Kbd size="sm">⌘</Kbd>
				<Kbd size="sm">K</Kbd>
			</Stack>
			<Stack direction="row" gap="1" align="center">
				<Kbd size="md">⌘</Kbd>
				<Kbd size="md">K</Kbd>
			</Stack>
		</Stack>
	);
}
