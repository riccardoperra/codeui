import { Select } from "@codeui/kit";

export default function SelectDisabledDemo() {
	return (
		<Select
			aria-label="Font"
			label="Font"
			options={["JetBrains Mono", "Fira Code"]}
			defaultValue="JetBrains Mono"
			disabled
		/>
	);
}
