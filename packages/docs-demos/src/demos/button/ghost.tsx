import { Button } from "@codeui/kit";

export default function Demo() {
	return (
		<div style={{ display: "flex", "flex-wrap": "wrap", gap: "var(--cui-space-3)", "align-items": "center" }}>
			<Button variant="primary" ghost>Copy snippet (primary)</Button>
			<Button variant="secondary" ghost>Copy snippet (secondary)</Button>
			<Button variant="tertiary" ghost>Copy snippet (tertiary)</Button>
			<Button variant="caution" ghost>Copy snippet (caution)</Button>
			<Button variant="negative" ghost>Copy snippet (negative)</Button>
		</div>
	);
}
