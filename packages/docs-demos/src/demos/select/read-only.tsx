import { Select } from "@codeui/kit";

export default function SelectReadOnlyDemo() {
	return (
		<Select
			aria-label="Workspace theme"
			label="Workspace theme"
			description="Set by the workspace owner."
			options={["Dracula", "One Dark", "Night Owl"]}
			defaultValue="Dracula"
			readOnly
		/>
	);
}
