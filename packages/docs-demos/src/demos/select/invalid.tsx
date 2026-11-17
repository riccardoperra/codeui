import { Select } from "@codeui/kit";

export default function SelectInvalidDemo() {
	return (
		<Select
			aria-label="Language"
			label="Language"
			placeholder="Choose a language"
			options={["TypeScript", "Rust", "Python"]}
			required
			validationState="invalid"
			errorMessage="Choose a language to highlight the snippet."
		/>
	);
}
