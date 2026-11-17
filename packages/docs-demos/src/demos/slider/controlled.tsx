import { Slider } from "@codeui/kit";
import { createSignal } from "solid-js";
export default function Demo() {
	const [value, setValue] = createSignal(75);
	const [committed, setCommitted] = createSignal(75);
	return (
		<Slider
			label="Background opacity"
			value={value()}
			onChange={setValue}
			onChangeEnd={setCommitted}
			showValue
			description={`Last committed value: ${committed()}`}
		/>
	);
}
