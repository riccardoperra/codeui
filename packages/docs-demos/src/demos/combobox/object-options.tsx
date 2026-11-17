import { createSignal } from "solid-js";
import { Combobox, createComboboxOptions } from "@codeui/kit";

type Language = { extension: string; name: string; legacy?: boolean };

const languages: Language[] = [
	{ extension: "ts", name: "TypeScript" },
	{ extension: "tsx", name: "TypeScript JSX" },
	{ extension: "js", name: "JavaScript" },
	{ extension: "as", name: "ActionScript", legacy: true },
	{ extension: "rs", name: "Rust" },
];

export default function ComboboxObjectOptionsDemo() {
	const [extension, setExtension] = createSignal<string | undefined>("ts");
	const options = createComboboxOptions(languages, {
		valueKey: "extension",
		labelKey: "name",
		disabledKey: "legacy",
	});
	return (
		<>
			<Combobox
				{...options.props()}
				{...options.controlled(extension, setExtension)}
				label="Language"
				placeholder="Search languages"
			/>
			<p>Extension: {extension() ?? "none"}</p>
		</>
	);
}
