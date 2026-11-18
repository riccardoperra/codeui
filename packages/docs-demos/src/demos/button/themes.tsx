import { Button } from "@codeui/kit";

export default function Demo() {
	return (
		<div style={{ display: "flex", "flex-wrap": "wrap", gap: "var(--cui-space-3)", "align-items": "center" }}>
			<Button variant="primary">Export PNG</Button>
			<Button variant="secondary">Copy snippet</Button>
			<Button variant="tertiary">Share snippet</Button>
			<Button variant="caution">Overwrite export</Button>
			<Button variant="negative">Delete snippet</Button>
		</div>
	);
}
