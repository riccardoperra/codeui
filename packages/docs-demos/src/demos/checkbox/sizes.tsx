import { Checkbox } from "@codeui/kit";
export default function Demo() {
	return (
		<div style={{ display: "grid", gap: "var(--cui-space-4)" }}>
			<Checkbox size="xs" label="Line numbers (xs)" defaultChecked />
			<Checkbox size="sm" label="Line numbers (sm)" defaultChecked />
			<Checkbox size="md" label="Line numbers (md)" defaultChecked />
			<Checkbox size="lg" label="Line numbers (lg)" defaultChecked />
			<Checkbox size="xl" label="Line numbers (xl)" defaultChecked />
		</div>
	);
}
