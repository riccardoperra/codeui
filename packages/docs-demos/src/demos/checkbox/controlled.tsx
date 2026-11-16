import { Checkbox } from "@codeui/kit";
import { createSignal } from "solid-js";
export default function Demo() {
	const [checked, setChecked] = createSignal(true);
	return (
		<>
			<Checkbox label="Show line numbers" checked={checked()} onChange={setChecked} />
			<output>{checked() ? "Enabled" : "Disabled"}</output>
		</>
	);
}
