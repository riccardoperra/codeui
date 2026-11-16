import { Slider } from "@codeui/kit";
export default function Demo() {
	return (
		<Slider
			label="Background opacity"
			defaultValue={0.75}
			minValue={0}
			maxValue={1}
			step={0.01}
			showValue
			getValueLabel={({ values }) => `${Math.round(values[0] * 100)} percent opacity`}
		/>
	);
}
