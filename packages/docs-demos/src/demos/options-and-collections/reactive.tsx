import { createSignal } from "solid-js";
import { Button, Combobox, createComboboxOptions } from "@codeui/kit";

type Preset = { id: number; name: string };

export default function ReactiveOptionsDemo() {
	const [presets, setPresets] = createSignal<Preset[]>([
		{ id: 1, name: "Blog header" },
		{ id: 2, name: "Tweet card" },
	]);
	const [presetId, setPresetId] = createSignal<number | undefined>(1);
	const presetOptions = createComboboxOptions(presets, { valueKey: "id", labelKey: "name" });
	const addPreset = () => {
		const id = presets().length + 1;
		setPresets([...presets(), { id, name: `Preset ${id}` }]);
	};
	return (
		<>
			<Combobox
				{...presetOptions.props()}
				{...presetOptions.controlled(presetId, setPresetId)}
				label="Preset"
				placeholder="Search presets"
			/>
			<Button theme="secondary" onClick={addPreset}>
				Save current as preset
			</Button>
		</>
	);
}
