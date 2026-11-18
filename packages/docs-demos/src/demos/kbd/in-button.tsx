import { Button, Kbd, Stack } from "@codeui/kit";

export default function KbdInButton() {
	return (
		<Button variant="secondary" aria-keyshortcuts="Meta+K">
			Search snippets
			<Stack as="kbd" direction="row" gap="0.5" aria-hidden="true">
				<Kbd variant="hint">⌘</Kbd>
				<Kbd variant="hint">K</Kbd>
			</Stack>
		</Button>
	);
}
