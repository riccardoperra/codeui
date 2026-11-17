import { Checkbox } from "@codeui/kit";
export default function Demo() {
	return (
		<div style={{ display: "grid", gap: "var(--cui-space-4)" }}>
			<Checkbox
				size="xs"
				label="Export options (xs)"
				validationState="invalid"
				errorMessage="Choose an export option."
			/>
			<Checkbox
				size="sm"
				label="Export options (sm)"
				validationState="invalid"
				errorMessage="Choose an export option."
			/>
			<Checkbox
				size="md"
				label="Export options (md)"
				validationState="invalid"
				errorMessage="Choose an export option."
			/>
			<Checkbox
				size="lg"
				label="Export options (lg)"
				validationState="invalid"
				errorMessage="Choose an export option."
			/>
			<Checkbox
				size="xl"
				label="Export options (xl)"
				validationState="invalid"
				errorMessage="Choose an export option."
			/>
		</div>
	);
}
