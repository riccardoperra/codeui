import { Select } from "@codeui/kit";

const scales = ["1x", "2x", "3x", "4x"];

export default function SelectDescriptionDemo() {
	return (
		<Select
			aria-label="Pixel ratio"
			label="Pixel ratio"
			description="Higher ratios export sharper images and larger files."
			options={scales}
			defaultValue="2x"
		/>
	);
}
