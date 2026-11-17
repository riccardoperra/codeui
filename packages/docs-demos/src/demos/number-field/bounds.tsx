import { NumberField } from "@codeui/kit";

export default function NumberFieldBounds() {
	return (
		<div style={{ width: "240px" }}>
			<NumberField
				label="Padding"
				description="From 0 to 128, in steps of 8."
				min={0}
				max={128}
				step={8}
				defaultValue={32}
			/>
		</div>
	);
}
