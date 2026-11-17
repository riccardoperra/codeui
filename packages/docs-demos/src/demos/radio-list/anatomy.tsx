import { RadioList, RadioListItem } from "@codeui/kit";

export default function RadioListAnatomy() {
	return (
		<RadioList
			label="Export format"
			description="Used by the export button."
			validationState="invalid"
			errorMessage="Choose an export format."
			defaultValue="png"
		>
			<RadioListItem value="png" label="PNG" />
			<RadioListItem value="svg" label="SVG" />
		</RadioList>
	);
}
