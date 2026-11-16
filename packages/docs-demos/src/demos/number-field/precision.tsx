import { NumberField } from "@codeui/kit";

export default function NumberFieldPrecision() {
	return (
		<div style={{ width: "240px" }}>
			<NumberField
				label="Line height"
				description="Two decimal digits. The comma is the decimal separator."
				min={1}
				max={3}
				step={0.25}
				precision={2}
				defaultValue={1.5}
			/>
		</div>
	);
}
