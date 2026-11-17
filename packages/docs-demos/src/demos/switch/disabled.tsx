import { Switch } from "@codeui/kit";
export default function Demo() {
	return (
		<>
			<Switch
				label="Show line numbers"
				description="Include line numbers in the export."
				disabled
				defaultChecked
			/>
			<Switch label="Show window header" disabled />
		</>
	);
}
