import { Combobox } from "@codeui/kit";

const languages = ["TypeScript", "JavaScript", "Rust", "Python", "Go"];

export default function ComboboxEmptyDemo() {
	return (
		<Combobox
			label="Language"
			placeholder="Try typing Haskell"
			options={languages}
			emptyContent="No language matches."
		/>
	);
}
