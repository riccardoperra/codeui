import { Stack, TextField } from "@codeui/kit";

export default function TextFieldStates() {
	return (
		<Stack gap="4" style={{ width: "320px" }}>
			<TextField label="Snippet name" required placeholder="Required" />
			<TextField label="Snippet id" readOnly defaultValue="snp_8f2a91" />
			<TextField label="Workspace" disabled defaultValue="Personal" />
		</Stack>
	);
}
