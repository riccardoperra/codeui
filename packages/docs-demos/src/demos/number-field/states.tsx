import { NumberField, Stack } from "@codeui/kit";

export default function NumberFieldStates() {
	return (
		<Stack gap="4" style={{ width: "240px" }}>
			<NumberField label="Tab size" required min={1} max={8} placeholder="Required" />
			<NumberField label="Export scale" readOnly defaultValue={2} />
			<NumberField label="Border radius" disabled defaultValue={12} />
		</Stack>
	);
}
