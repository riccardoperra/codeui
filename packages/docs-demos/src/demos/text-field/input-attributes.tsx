import { TextField } from "@codeui/kit";

export default function TextFieldInputAttributes() {
	return (
		<div style={{ width: "320px" }}>
			<TextField
				label="Notification email"
				type="email"
				autocomplete="email"
				inputmode="email"
				spellcheck={false}
				maxLength={120}
				placeholder="you@example.com"
			/>
		</div>
	);
}
