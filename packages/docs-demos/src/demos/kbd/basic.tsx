import { Kbd, Stack, Text } from "@codeui/kit";

export default function KbdBasic() {
	return (
		<Stack direction="row" gap="2" align="center">
			<Text tone="muted">Press</Text>
			<Kbd>Esc</Kbd>
			<Text tone="muted">to close the export panel.</Text>
		</Stack>
	);
}
