import { NumberField, Stack } from "@codeui/kit";

export default function NumberFieldPrefixPostfix() {
	return (
		<Stack gap="4" style={{ width: "240px" }}>
			<NumberField label="Export width" postfix=" px" min={320} max={4096} defaultValue={1280} />
			<NumberField label="Opacity" postfix=" %" min={0} max={100} defaultValue={80} />
			<NumberField label="Shadow offset" prefix="× " min={0} max={4} precision={1} defaultValue={1.5} />
		</Stack>
	);
}
