import { Stack, TextField } from "@codeui/kit";

export default function TextFieldThemes() {
	return (
		<Stack gap="4" style={{ width: "320px" }}>
			<TextField variant="filled" label="Filled" defaultValue="hello-codeimage.ts" />
			<TextField variant="inline" label="Inline" defaultValue="hello-codeimage.ts" />
		</Stack>
	);
}
