import { Slider } from "@codeui/kit";
export default function Demo() {
	return (
		<Slider
			label="Background opacity"
			defaultValue={75}
			showValue
			validationState="invalid"
			errorMessage="Choose a background opacity."
		/>
	);
}
