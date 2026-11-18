import { IconButton, Tooltip } from "@codeui/kit";

export default function Demo() {
	return (
		<div style={{ width: "100%" }}><Tooltip content="Copy snippet"><IconButton variant="secondary" block aria-label="Copy snippet"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><rect x="8" y="8" width="12" height="12" rx="2" /><path d="M16 8V4H4v12h4" /></svg></IconButton></Tooltip></div>
	);
}
