import { OptionCardGroup } from "@codeui/kit";
export default function Themes() {
	return <OptionCardGroup label="Theme cards" variant="tile" defaultValue="window" items={[
		{ value: "window", label: "Window", badge: "Default", preview: <svg width="96" height="68" viewBox="0 0 96 68" aria-hidden="true"><rect x="8" y="8" width="80" height="52" rx="8" fill="var(--cui-surface-canvas)"/><path d="M20 24h56M20 36h32M20 48h44" stroke="var(--cui-text-muted)" stroke-width="4"/></svg> },
		{ value: "orb", label: "Orb", preview: <svg width="96" height="68" viewBox="0 0 96 68" aria-hidden="true"><circle cx="48" cy="34" r="24" fill="var(--cui-text-muted)"/><circle cx="42" cy="28" r="12" fill="var(--cui-surface-canvas)"/></svg> },
		{ value: "list", label: "Aa list", preview: <span style={{ "font-size": "var(--cui-font-size-lg)" }} aria-hidden="true">Aa</span> },
	]} />;
}
