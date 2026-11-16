import { Checkbox } from "@codeui/kit";
export default function Demo() {
	return (
		<>
			<Checkbox
				label="Show line numbers"
				description="Include line numbers in the export."
				disabled
				defaultChecked
			/>
			<Checkbox label="Show window header" disabled />
		</>
	);
}
