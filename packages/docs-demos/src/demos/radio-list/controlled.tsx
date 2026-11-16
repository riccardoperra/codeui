import { RadioList, RadioListItem } from "@codeui/kit";
import { createSignal } from "solid-js";
export default function Demo() {
	const [value, setValue] = createSignal("png");
	return (
		<RadioList label="Export format" value={value()} onChange={setValue}>
			<RadioListItem value="png" label="PNG" />
			<RadioListItem value="svg" label="SVG" />
			<RadioListItem value="jpeg" label="JPEG" disabled />
		</RadioList>
	);
}
