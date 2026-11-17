import { Stack, TextArea } from "@codeui/kit";

export default function TextAreaThemes() {
	return (
		<Stack gap="4" style={{ width: "360px" }}>
			<TextArea theme="filled" label="Filled" defaultValue="Renders the greeting in the console." />
			<TextArea theme="inline" label="Inline" defaultValue="Renders the greeting in the console." />
		</Stack>
	);
}
