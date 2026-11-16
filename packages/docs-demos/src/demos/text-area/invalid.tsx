import { TextArea } from "@codeui/kit";
import { createSignal } from "solid-js";

const LIMIT = 80;

export default function TextAreaInvalid() {
	const [caption, setCaption] = createSignal(
		"A long caption that explains every line of the snippet, one by one, in detail.",
	);
	return (
		<div style={{ width: "360px" }}>
			<TextArea
				label="Caption"
				options={{ autoResize: true }}
				value={caption()}
				onChange={setCaption}
				description={`${caption().length} of ${LIMIT} characters`}
				validationState={caption().length > LIMIT ? "invalid" : "valid"}
				errorMessage={`Keep the caption under ${LIMIT} characters.`}
			/>
		</div>
	);
}
