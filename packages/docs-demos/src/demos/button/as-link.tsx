import { Button } from "@codeui/kit";

export default function Demo() {
	return (
		<div style={{ display: "flex", "flex-wrap": "wrap", gap: "var(--cui-space-3)", "align-items": "center" }}>
			<Button as="a" href="https://codeimage.dev" variant="secondary">Open CodeImage</Button>
		</div>
	);
}
