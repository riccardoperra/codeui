import { Button } from "@codeui/kit";

export default function Demo() {
	return (
		<div style={{ display: "flex", "flex-wrap": "wrap", gap: "var(--cui-space-3)", "align-items": "center" }}>
			<Button theme="primary" variant="ghost">Copy snippet (primary)</Button>
			<Button theme="secondary" variant="ghost">Copy snippet (secondary)</Button>
			<Button theme="tertiary" variant="ghost">Copy snippet (tertiary)</Button>
			<Button theme="caution" variant="ghost">Copy snippet (caution)</Button>
			<Button theme="negative" variant="ghost">Copy snippet (negative)</Button>
		</div>
	);
}
