import { Combobox } from "@codeui/kit";

export default function ComboboxDescriptionDemo() {
	return (
		<Combobox
			label="Language"
			description="Sets the syntax highlighting of the snippet."
			options={["TypeScript", "Rust", "Python"]}
			defaultValue="TypeScript"
		/>
	);
}
