import { Button } from "@codeui/kit";

export default function Demo() {
	return (
		<div style={{ display: "flex", "flex-wrap": "wrap", gap: "var(--cui-space-3)", "align-items": "center" }}>
			<Button theme="primary">Export PNG</Button>
			<Button theme="secondary">Copy snippet</Button>
			<Button theme="tertiary">Share snippet</Button>
			<Button theme="caution">Overwrite export</Button>
			<Button theme="negative">Delete snippet</Button>
		</div>
	);
}
