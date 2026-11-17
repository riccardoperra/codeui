import { NumberField } from "@codeui/kit";
import { createSignal } from "solid-js";

export default function NumberFieldBasic() {
	const [fontSize, setFontSize] = createSignal<number | null | undefined>(14);
	return (
		<div style={{ width: "240px" }}>
			<NumberField
				label="Font size"
				description="Between 8 and 32 pixels."
				min={8}
				max={32}
				value={fontSize()}
				onChange={setFontSize}
			/>
		</div>
	);
}
