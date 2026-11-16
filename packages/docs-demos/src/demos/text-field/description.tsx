import { TextField } from "@codeui/kit";

export default function TextFieldDescription() {
	return (
		<div style={{ width: "320px" }}>
			<TextField
				label="Export file name"
				defaultValue="snippet"
				description={
					<>
						Saved as <code>snippet.png</code>. Letters, numbers and dashes only.
					</>
				}
			/>
		</div>
	);
}
