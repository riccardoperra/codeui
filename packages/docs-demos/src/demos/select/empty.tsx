import { Select } from "@codeui/kit";

const presets: string[] = [];

export default function SelectEmptyDemo() {
	return (
		<Select
			aria-label="Preset"
			label="Preset"
			placeholder="No saved presets"
			description="Save a preset from the editor to list it here."
			options={presets}
			disabled={presets.length === 0}
		/>
	);
}
