import { Switch } from "@codeui/kit";
export default function Demo() {
	return (
		<div style={{ display: "grid", gap: "var(--cui-space-4)" }}>
			<Switch size="sm" label="Line numbers (sm)" defaultChecked />
			<Switch size="md" label="Line numbers (md)" defaultChecked />
		</div>
	);
}
