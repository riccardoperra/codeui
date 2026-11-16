import { RadioList, RadioListItem, Button } from "@codeui/kit";
import { createSignal, For } from "solid-js";
export default function Demo() {
	const [result, setResult] = createSignal("");
	return (
		<form
			onSubmit={event => {
				event.preventDefault();
				setResult(
					new FormData(event.currentTarget).get("format")?.toString() ?? "omitted",
				);
			}}
		>
			<RadioList label="Export format" name="format" defaultValue="png">
				<RadioListItem value="png" label="PNG" />
				<RadioListItem value="svg" label="SVG" />
				<RadioListItem value="jpeg" label="JPEG" disabled />
			</RadioList>
			<Button type="submit">Inspect form value</Button>
			<output>{result()}</output>
		</form>
	);
}
