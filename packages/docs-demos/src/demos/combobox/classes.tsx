import { Combobox } from "@codeui/kit";

export default function ComboboxClassesDemo() {
	return (
		<Combobox
			label="Font"
			options={["JetBrains Mono", "Fira Code", "Source Code Pro"]}
			defaultValue="Fira Code"
			class="font-search"
			classes={{
				control: "font-search-control",
				input: "font-search-input",
				content: "font-search-list",
				item: "font-search-item",
			}}
		/>
	);
}
