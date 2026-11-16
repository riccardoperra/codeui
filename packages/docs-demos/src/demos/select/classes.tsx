import { Select } from "@codeui/kit";

const fonts = ["JetBrains Mono", "Fira Code", "Source Code Pro", "Cascadia Code"];

export default function SelectClassesDemo() {
	return (
		<Select
			aria-label="Font"
			label="Font"
			options={fonts}
			defaultValue="Fira Code"
			classes={{
				root: "font-picker",
				trigger: "font-picker-trigger",
				content: "font-picker-list",
				item: "font-picker-item",
			}}
		/>
	);
}
