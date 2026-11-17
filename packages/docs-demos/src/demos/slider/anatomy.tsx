import { Slider } from "@codeui/kit";

export default function SliderAnatomy() {
	return (
		<div style={{ width: "280px" }}>
			<Slider
				label="Background opacity"
				description="Applies to the exported image."
				defaultValue={75}
				showValue
				validationState="invalid"
				errorMessage="Choose a background opacity."
			/>
		</div>
	);
}
