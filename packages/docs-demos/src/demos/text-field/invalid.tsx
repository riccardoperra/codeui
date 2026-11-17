import { TextField } from "@codeui/kit";
import { createSignal } from "solid-js";

export default function TextFieldInvalid() {
	const [link, setLink] = createSignal("codeimage");
	const invalid = () => !/^https?:\/\/\S+$/.test(link());
	return (
		<div style={{ width: "320px" }}>
			<TextField
				label="Share link"
				value={link()}
				onChange={setLink}
				validationState={invalid() ? "invalid" : "valid"}
				errorMessage="Enter a full URL, starting with https://."
			/>
		</div>
	);
}
