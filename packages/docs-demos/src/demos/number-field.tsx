import { createSignal } from "solid-js";
import { NumberField } from "@codeui/kit";

export default function NumberFieldDemo() {
	const [fontSize, setFontSize] = createSignal<number | null | undefined>(14);
	return (
		<NumberField
			label="Font size"
			description="Between 8 and 32 pixels."
			min={8}
			max={32}
			value={fontSize()}
			onChange={setFontSize}
		/>
	);
}
