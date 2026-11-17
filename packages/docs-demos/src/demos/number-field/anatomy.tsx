import { NumberField } from "@codeui/kit";

export default function NumberFieldAnatomy() {
	return (
		<div style={{ width: "260px" }}>
			<NumberField
				label="Export width"
				description="Between 320 and 4096 pixels."
				postfix=" px"
				defaultValue={200}
				validationState="invalid"
				errorMessage="Enter at least 320 pixels."
			/>
		</div>
	);
}
