import { createSignal } from "solid-js";
import { createSelectOptions, Select } from "@codeui/kit";

const themes = [
	{ name: "Dracula", id: "dracula" },
	{ name: "One Dark", id: "one-dark" },
	{ name: "Night Owl", id: "night-owl" },
];

export default function SelectOptionsDemo() {
	const [theme, setTheme] = createSignal("dracula");
	const themeOptions = createSelectOptions(themes, { key: "name", valueKey: "id" });
	return (
		<Select
			aria-label="Theme"
			label="Theme"
			placeholder="Choose a theme"
			options={themeOptions.options()}
			{...themeOptions.props()}
			value={themeOptions.optionFromValue(theme())}
			onChange={option => option && setTheme(option.value)}
		/>
	);
}
