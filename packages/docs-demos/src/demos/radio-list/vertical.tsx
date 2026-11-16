import { RadioList, RadioListItem } from "@codeui/kit";
export default function Demo() {
	return (
		<RadioList label="Export format" orientation="vertical">
			<RadioListItem value="png" label="PNG" />
			<RadioListItem value="svg" label="SVG" />
			<RadioListItem value="jpeg" label="JPEG" disabled />
		</RadioList>
	);
}
