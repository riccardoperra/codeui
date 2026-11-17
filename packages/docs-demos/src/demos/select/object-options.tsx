import { createSignal } from "solid-js";
import { createSelectOptions, Select } from "@codeui/kit";

type Theme = { id: string; name: string };

const themes: Theme[] = [
	{ id: "dracula", name: "Dracula" },
	{ id: "one-dark", name: "One Dark" },
	{ id: "night-owl", name: "Night Owl" },
	{ id: "github-light", name: "GitHub Light" },
];

export default function SelectObjectOptionsDemo() {
	const [themeId, setThemeId] = createSignal<string | undefined>("dracula");
	const themeOptions = createSelectOptions(themes, { key: "name", valueKey: "id" });
	return (
		<Select
			aria-label="Theme"
			label="Theme"
			placeholder="Choose a theme"
			options={themeOptions.options()}
			{...themeOptions.props()}
			{...themeOptions.controlled(themeId, setThemeId)}
		/>
	);
}
