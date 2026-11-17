import { createSignal } from "solid-js";
import { RadioList, RadioListItem } from "@codeui/kit";

export default function RadioListDemo() {
	const [format, setFormat] = createSignal("png");
	return (
		<RadioList
			label="Export format"
			description="SVG keeps the text selectable."
			value={format()}
			onChange={setFormat}
		>
			<RadioListItem value="png" label="PNG" />
			<RadioListItem value="svg" label="SVG" />
			<RadioListItem value="jpeg" label="JPEG" />
		</RadioList>
	);
}
