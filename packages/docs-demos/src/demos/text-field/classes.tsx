import { TextField } from "@codeui/kit";
import "./classes.css";

export default function TextFieldClasses() {
	return (
		<TextField
			label="Snippet name"
			defaultValue="hello-codeimage.ts"
			description="Shown in the window title."
			classes={{
				root: "snippet-name-field",
				input: "snippet-name-input",
			}}
		/>
	);
}
