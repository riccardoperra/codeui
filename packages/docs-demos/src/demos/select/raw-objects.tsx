import { Select } from "@codeui/kit";

type Language = { extension: string; name: string };

const languages: Language[] = [
	{ extension: "ts", name: "TypeScript" },
	{ extension: "rs", name: "Rust" },
	{ extension: "py", name: "Python" },
	{ extension: "go", name: "Go" },
];

export default function SelectRawObjectsDemo() {
	return (
		<Select
			aria-label="Language"
			label="Language"
			placeholder="Choose a language"
			options={languages}
			optionValue="extension"
			optionTextValue="name"
			itemLabel={language => language.name}
			valueComponent={language => language().name}
			defaultValue={languages[0]}
		/>
	);
}
