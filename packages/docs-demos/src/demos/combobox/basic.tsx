import { Combobox } from "@codeui/kit";

const languages = ["TypeScript", "JavaScript", "Rust", "Python", "Go", "Kotlin", "Swift"];

export default function ComboboxBasicDemo() {
	return (
		<Combobox
			label="Language"
			placeholder="Search languages"
			options={languages}
			defaultValue="TypeScript"
		/>
	);
}
