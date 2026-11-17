import { TextArea } from "@codeui/kit";

export default function TextAreaAutoResize() {
	return (
		<div style={{ width: "360px" }}>
			<TextArea
				label="Caption"
				description="Grows with the text. Enter submits the form, Shift+Enter adds a line."
				placeholder="Describe the snippet"
				options={{ autoResize: true, submitOnEnter: true }}
			/>
		</div>
	);
}
