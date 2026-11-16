import { createSignal } from "solid-js";
import { Combobox } from "@codeui/kit";

const languages = ["TypeScript", "JavaScript", "Rust", "Python", "Go"];

export default function ComboboxControlledDemo() {
	const [language, setLanguage] = createSignal<string | null>("Rust");
	return (
		<>
			<Combobox
				label="Language"
				placeholder="Search languages"
				options={languages}
				value={language()}
				onChange={setLanguage}
			/>
			<p>Selected: {language() ?? "none"}</p>
		</>
	);
}
