import { Combobox } from "@codeui/kit";

export default function ComboboxDisabledDemo() {
	return (
		<Combobox
			label="Language"
			options={["TypeScript", "Rust", "Python"]}
			defaultValue="TypeScript"
			disabled
		/>
	);
}
