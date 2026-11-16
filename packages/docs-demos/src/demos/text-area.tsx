import { createSignal } from "solid-js";
import { TextArea } from "@codeui/kit";

export default function TextAreaDemo() {
	const [code, setCode] = createSignal("const greeting = 'Hello CodeImage';");
	return (
		<TextArea
			label="Snippet"
			description="Paste the code to render."
			placeholder="Paste your code"
			value={code()}
			onChange={setCode}
		/>
	);
}
