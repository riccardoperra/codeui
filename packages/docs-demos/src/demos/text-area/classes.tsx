import { TextArea } from "@codeui/kit";
import "./classes.css";

export default function TextAreaClasses() {
	return (
		<TextArea
			label="Snippet"
			defaultValue={"const greeting = 'Hello CodeImage';"}
			spellcheck={false}
			classes={{ root: "snippet-code-field", input: "snippet-code-input" }}
		/>
	);
}
