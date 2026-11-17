import { NumberField } from "@codeui/kit";
import { createSignal } from "solid-js";

export default function NumberFieldInvalid() {
	const [width, setWidth] = createSignal<number | null | undefined>(null);
	return (
		<div style={{ width: "240px" }}>
			<NumberField
				label="Export width"
				postfix=" px"
				min={320}
				max={4096}
				value={width()}
				onChange={setWidth}
				validationState={width() == null ? "invalid" : "valid"}
				errorMessage="Enter a width between 320 and 4096 pixels."
			/>
		</div>
	);
}
