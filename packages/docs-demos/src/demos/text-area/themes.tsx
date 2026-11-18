import { Stack, TextArea } from "@codeui/kit";

export default function TextAreaThemes() {
	return (
		<Stack gap="4" style={{ width: "360px" }}>
			<TextArea variant="filled" label="Filled" defaultValue="Renders the greeting in the console." />
			<TextArea variant="inline" label="Inline" defaultValue="Renders the greeting in the console." />
		</Stack>
	);
}
