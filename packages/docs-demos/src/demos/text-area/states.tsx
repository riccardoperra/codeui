import { Stack, TextArea } from "@codeui/kit";

export default function TextAreaStates() {
	return (
		<Stack gap="4" style={{ width: "360px" }}>
			<TextArea label="Caption" required placeholder="Required" />
			<TextArea label="Generated alt text" readOnly options={{ autoResize: true }} defaultValue="A TypeScript snippet that logs a greeting." />
			<TextArea label="Notes" disabled defaultValue="Locked by the workspace owner." />
		</Stack>
	);
}
