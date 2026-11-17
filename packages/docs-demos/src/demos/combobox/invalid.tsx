import { Combobox } from "@codeui/kit";

export default function ComboboxInvalidDemo() {
	return (
		<Combobox
			label="Language"
			placeholder="Search languages"
			options={["TypeScript", "Rust", "Python"]}
			required
			validationState="invalid"
			errorMessage="Choose a language to highlight the snippet."
		/>
	);
}
