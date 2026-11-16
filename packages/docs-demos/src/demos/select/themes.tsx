import { Select } from "@codeui/kit";

const fonts = ["JetBrains Mono", "Fira Code", "Source Code Pro"];

export default function SelectThemesDemo() {
	return (
		<>
			<Select aria-label="Font" label="Filled" options={fonts} defaultValue="Fira Code" theme="filled" />
			<Select aria-label="Font" label="Inline" options={fonts} defaultValue="Fira Code" theme="inline" />
		</>
	);
}
