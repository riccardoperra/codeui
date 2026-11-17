import { Select } from "@codeui/kit";

// In 0.1.x: slotClasses={{ input: "font-picker-trigger", errorLabel: "font-picker-error" }}
// `slotClasses` still works and is deprecated. Move to `classes`, keyed by part name.
export default function SelectClasses() {
	return (
		<Select
			aria-label="Font"
			label="Font"
			options={["JetBrains Mono", "Fira Code", "Source Code Pro"]}
			defaultValue="JetBrains Mono"
			classes={{
				trigger: "font-picker-trigger",
				errorMessage: "font-picker-error",
				content: "font-picker-list",
			}}
		/>
	);
}
