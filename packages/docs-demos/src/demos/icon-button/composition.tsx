import { IconButton, Tooltip, icons } from "@codeui/kit";

export default function Demo() {
	return (
		<div style={{ display: "flex", "flex-wrap": "wrap", gap: "var(--cui-space-3)", "align-items": "center" }}>
			<Tooltip content="Previous snippet"><IconButton theme="secondary" aria-label="Previous snippet"><icons.PreviousIcon aria-hidden="true" /></IconButton></Tooltip>
			<Tooltip content="Next snippet"><IconButton theme="secondary" aria-label="Next snippet"><icons.NextIcon aria-hidden="true" /></IconButton></Tooltip>
		</div>
	);
}
