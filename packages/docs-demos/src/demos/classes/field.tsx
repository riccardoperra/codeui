import { TextField, mergeClasses } from "@codeui/kit";
export default function Field() {
	return <TextField label="Snippet name" defaultValue="Fetch example" description="Used as the export filename."
		classes={{ root: mergeClasses("snippet-field", undefined), input: "snippet-name", description: "snippet-hint" }} />;
}
