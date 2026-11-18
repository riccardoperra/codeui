import { Button } from "@codeui/kit";

export default function Demo() {
	return (
		<div style={{ display: "flex", "flex-wrap": "wrap", gap: "var(--cui-space-3)", "align-items": "center" }}>
			<Button variant="secondary" size="xs">Copy snippet (xs)</Button>
			<Button variant="secondary" size="sm">Copy snippet (sm)</Button>
			<Button variant="secondary" size="md">Copy snippet (md)</Button>
			<Button variant="secondary" size="lg">Copy snippet (lg)</Button>
		</div>
	);
}
