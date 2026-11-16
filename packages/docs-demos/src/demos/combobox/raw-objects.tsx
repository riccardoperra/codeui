import { Combobox } from "@codeui/kit";

type Theme = { id: string; name: string; dark: boolean; disabled: boolean };

const themes: Theme[] = [
	{ id: "dracula", name: "Dracula", dark: true, disabled: false },
	{ id: "one-dark", name: "One Dark", dark: true, disabled: false },
	{ id: "solarized", name: "Solarized Light", dark: false, disabled: true },
	{ id: "github-light", name: "GitHub Light", dark: false, disabled: false },
];

export default function ComboboxRawObjectsDemo() {
	return (
		<Combobox
			label="Theme"
			placeholder="Search themes"
			options={themes}
			optionValue="id"
			optionTextValue="name"
			optionLabel="name"
			optionDisabled="disabled"
			renderOption={theme => (
				<>
					{theme.name} <span style={{ opacity: 0.6 }}>{theme.dark ? "Dark" : "Light"}</span>
				</>
			)}
		/>
	);
}
