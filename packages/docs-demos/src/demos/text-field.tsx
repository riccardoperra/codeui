import { createSignal } from "solid-js";
import { TextField } from "@codeui/kit";

export default function TextFieldDemo() {
	const [name, setName] = createSignal("untitled");
	return (
		<>
			<TextField
				label="Snippet name"
				placeholder="my-snippet"
				description="Used as the file name of the export."
				value={name()}
				onChange={setName}
			/>
			<TextField
				label="Share link"
				value="codeimage"
				validationState="invalid"
				errorMessage="Enter a full URL."
			/>
		</>
	);
}
