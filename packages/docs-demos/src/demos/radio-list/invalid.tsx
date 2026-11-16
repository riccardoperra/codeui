import { RadioList, RadioListItem } from "@codeui/kit";
export default function Demo() {
	return (
		<div style={{ display: "grid", gap: "var(--cui-space-4)" }}>
			<RadioList
				size="xs"
				label="Export options (xs)"
				validationState="invalid"
				errorMessage="Choose an export option."
			>
				<RadioListItem value="png" label="PNG" />
				<RadioListItem value="svg" label="SVG" />
			</RadioList>
			<RadioList
				size="sm"
				label="Export options (sm)"
				validationState="invalid"
				errorMessage="Choose an export option."
			>
				<RadioListItem value="png" label="PNG" />
				<RadioListItem value="svg" label="SVG" />
			</RadioList>
			<RadioList
				size="md"
				label="Export options (md)"
				validationState="invalid"
				errorMessage="Choose an export option."
			>
				<RadioListItem value="png" label="PNG" />
				<RadioListItem value="svg" label="SVG" />
			</RadioList>
			<RadioList
				size="lg"
				label="Export options (lg)"
				validationState="invalid"
				errorMessage="Choose an export option."
			>
				<RadioListItem value="png" label="PNG" />
				<RadioListItem value="svg" label="SVG" />
			</RadioList>
			<RadioList
				size="xl"
				label="Export options (xl)"
				validationState="invalid"
				errorMessage="Choose an export option."
			>
				<RadioListItem value="png" label="PNG" />
				<RadioListItem value="svg" label="SVG" />
			</RadioList>
		</div>
	);
}
