import { createSignal } from "solid-js";
import { Checkbox } from "@codeui/kit";

export default function CheckboxDemo() {
	const [lineNumbers, setLineNumbers] = createSignal(true);
	return (
		<>
			<Checkbox label="Show line numbers" checked={lineNumbers()} onChange={setLineNumbers} />
			<Checkbox label="Show window header" description="Adds the title bar above the code." />
			<Checkbox label="Transparent background" disabled />
		</>
	);
}
