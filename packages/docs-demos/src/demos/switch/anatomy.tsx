import { Switch } from "@codeui/kit";

export default function SwitchAnatomy() {
	return (
		<Switch
			label="Show line numbers"
			description="Include line numbers in the export."
			validationState="invalid"
			errorMessage="Enable line numbers before you export."
			defaultChecked
		/>
	);
}
