import { NumberField, Stack } from "@codeui/kit";

export default function NumberFieldThemes() {
	return (
		<Stack gap="4" style={{ width: "240px" }}>
			<NumberField variant="filled" label="Filled" defaultValue={16} />
			<NumberField variant="inline" label="Inline" defaultValue={16} />
		</Stack>
	);
}
