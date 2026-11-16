import { createSignal } from "solid-js";
import { Combobox } from "@codeui/kit";

const languages = ["TypeScript", "JavaScript", "Rust", "Python", "Go"];

export default function ComboboxInputValueDemo() {
	const [text, setText] = createSignal("");
	return (
		<>
			<Combobox
				label="Language"
				placeholder="Search languages"
				options={languages}
				inputValue={text()}
				onInputChange={value => setText(value.slice(0, 12))}
			/>
			<p>Search text: "{text()}"</p>
		</>
	);
}
