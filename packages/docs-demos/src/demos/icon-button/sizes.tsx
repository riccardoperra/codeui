import { IconButton, Tooltip } from "@codeui/kit";

export default function Demo() {
	return (
		<div style={{ display: "flex", "flex-wrap": "wrap", gap: "var(--cui-space-3)", "align-items": "center" }}>
			<Tooltip content="Copy snippet (xs)"><IconButton variant="secondary" size="xs" aria-label="Copy snippet (xs)"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><rect x="8" y="8" width="12" height="12" rx="2" /><path d="M16 8V4H4v12h4" /></svg></IconButton></Tooltip>
			<Tooltip content="Copy snippet (sm)"><IconButton variant="secondary" size="sm" aria-label="Copy snippet (sm)"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><rect x="8" y="8" width="12" height="12" rx="2" /><path d="M16 8V4H4v12h4" /></svg></IconButton></Tooltip>
			<Tooltip content="Copy snippet (md)"><IconButton variant="secondary" size="md" aria-label="Copy snippet (md)"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><rect x="8" y="8" width="12" height="12" rx="2" /><path d="M16 8V4H4v12h4" /></svg></IconButton></Tooltip>
			<Tooltip content="Copy snippet (lg)"><IconButton variant="secondary" size="lg" aria-label="Copy snippet (lg)"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><rect x="8" y="8" width="12" height="12" rx="2" /><path d="M16 8V4H4v12h4" /></svg></IconButton></Tooltip>
		</div>
	);
}
