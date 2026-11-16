import { Slider, Button } from "@codeui/kit";
import { createSignal, For } from "solid-js";
export default function Demo() {
	const [result, setResult] = createSignal("");
	return (
		<form
			onSubmit={event => {
				event.preventDefault();
				setResult(
					new FormData(event.currentTarget).get("opacity")?.toString() ?? "omitted",
				);
			}}
		>
			<Slider label="Opacity" name="opacity" defaultValue={75} showValue />
			<Button type="submit">Inspect form value</Button>
			<output>{result()}</output>
		</form>
	);
}
