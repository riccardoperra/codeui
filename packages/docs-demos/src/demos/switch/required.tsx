import { Switch } from "@codeui/kit";
export default function Demo() {
	return (
		<Switch
			label="Show line numbers"
			description="Include line numbers in the export."
			required
			defaultChecked
		/>
	);
}
