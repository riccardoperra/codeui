import { TextArea } from "@codeui/kit";

export default function TextAreaBasic() {
	return (
		<div style={{ width: "360px" }}>
			<TextArea
				label="Snippet"
				description="Paste the code to render."
				placeholder="Paste your code"
				options={{ autoResize: true }}
				defaultValue={"const greeting = 'Hello CodeImage';\nconsole.log(greeting);"}
			/>
		</div>
	);
}
