import { Combobox } from "@codeui/kit";

const fonts = ["JetBrains Mono", "Fira Code", "Source Code Pro"];

export default function ComboboxSizesDemo() {
	return (
		<>
			<Combobox label="Size sm" size="sm" options={fonts} defaultValue="Fira Code" />
			<Combobox label="Size md" size="md" options={fonts} defaultValue="Fira Code" />
		</>
	);
}
