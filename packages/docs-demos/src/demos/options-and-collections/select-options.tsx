import { createSignal } from "solid-js";
import { createSelectOptions, Select } from "@codeui/kit";

type Theme = { id: string; name: string };

const themes: Theme[] = [
	{ id: "dracula", name: "Dracula" },
	{ id: "one-dark", name: "One Dark" },
	{ id: "night-owl", name: "Night Owl" },
];

export default function SelectOptionsHelperDemo() {
	const [themeId, setThemeId] = createSignal("dracula");
	const themeOptions = createSelectOptions(themes, { key: "name", valueKey: "id" });
	return (
		<>
			<Select
				aria-label="Theme"
				label="Theme"
				options={themeOptions.options()}
				{...themeOptions.props()}
				value={themeOptions.optionFromValue(themeId())}
				onChange={option => {
					const id = themeOptions.optionToValue(option);
					if (id) setThemeId(id);
				}}
			/>
			<p>Stored value: {themeId()}</p>
		</>
	);
}
