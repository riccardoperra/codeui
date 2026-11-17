import { TextArea } from "@codeui/kit";

export default function TextAreaAnatomy() {
	return (
		<div style={{ width: "320px" }}>
			<TextArea
				label="Caption"
				description="Shown under the exported image."
				defaultValue="A caption that explains every line of the snippet."
				validationState="invalid"
				errorMessage="Keep the caption under 40 characters."
			/>
		</div>
	);
}
