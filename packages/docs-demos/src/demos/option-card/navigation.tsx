import { OptionCardGroup } from "@codeui/kit";
export default function Navigation() {
	return <OptionCardGroup label="Navigation" defaultValue="accordion" items={[
		{ value: "accordion", label: "Accordion", description: "One section open at a time", badge: "Default", preview: <svg width="96" height="68" viewBox="0 0 96 68" aria-hidden="true"><rect x="12" y="8" width="72" height="52" rx="8" fill="var(--cui-surface-canvas)"/><path d="M24 20h48M24 34h32M24 48h48" stroke="var(--cui-text-muted)" stroke-width="4"/></svg> },
		{ value: "rail", label: "Rail", description: "Keep section shortcuts visible", preview: <svg width="96" height="68" viewBox="0 0 96 68" aria-hidden="true"><rect x="12" y="8" width="72" height="52" rx="8" fill="var(--cui-surface-canvas)"/><path d="M26 20v28M42 20h28M42 34h20M42 48h28" stroke="var(--cui-text-muted)" stroke-width="4"/></svg> },
	]} />;
}
