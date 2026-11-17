import { Button } from "@codeui/kit";

export default function Demo() {
	return (
		<div style={{ display: "flex", "flex-wrap": "wrap", gap: "var(--cui-space-3)", "align-items": "center" }}>
			<Button theme="secondary" size="xs">Copy snippet (xs)</Button>
			<Button theme="secondary" size="sm">Copy snippet (sm)</Button>
			<Button theme="secondary" size="md">Copy snippet (md)</Button>
			<Button theme="secondary" size="lg">Copy snippet (lg)</Button>
			<Button theme="secondary" size="xl">Copy snippet (xl)</Button>
		</div>
	);
}
