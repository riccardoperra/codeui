import { Link, Stack } from "@codeui/kit";

export default function StackAs() {
	return (
		<Stack as="nav" aria-label="Export formats" direction="row" gap="4">
			<Link href="#png">PNG</Link>
			<Link href="#svg">SVG</Link>
			<Link href="#jpeg">JPEG</Link>
		</Stack>
	);
}
