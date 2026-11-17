import { TextField } from "@codeui/kit";

export default function TextFieldAnatomy() {
	return (
		<div style={{ width: "320px" }}>
			<TextField
				label="Share link"
				description="Anyone with the link can view the snippet."
				defaultValue="codeimage"
				validationState="invalid"
				errorMessage="Enter a full URL, starting with https://."
			/>
		</div>
	);
}
