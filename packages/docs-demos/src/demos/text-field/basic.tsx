import { TextField } from "@codeui/kit";

export default function TextFieldBasic() {
	return (
		<div style={{ width: "320px" }}>
			<TextField
				label="Snippet name"
				placeholder="my-snippet"
				description="Used as the file name of the export."
			/>
		</div>
	);
}
