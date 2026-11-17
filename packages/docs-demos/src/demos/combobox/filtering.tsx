import { Combobox } from "@codeui/kit";

const languages = ["TypeScript", "JavaScript", "CoffeeScript", "Rust", "Ruby", "Python"];

export default function ComboboxFilteringDemo() {
	return (
		<>
			<Combobox
				label="Contains (default)"
				placeholder="Type script"
				options={languages}
			/>
			<Combobox
				label="Starts with"
				placeholder="Type ru"
				options={languages}
				defaultFilter="startsWith"
			/>
			<Combobox
				label="Custom: initials"
				placeholder="Type ts or js"
				options={languages}
				defaultFilter={(language, text) =>
					language
						.replace(/[^A-Z]/g, "")
						.toLowerCase()
						.startsWith(text.toLowerCase())
				}
			/>
		</>
	);
}
