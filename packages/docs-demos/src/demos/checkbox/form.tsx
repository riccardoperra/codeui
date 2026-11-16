import { Checkbox, Button } from "@codeui/kit";
import { createSignal, For } from "solid-js";
export default function Demo() {
	const [result, setResult] = createSignal("Submit to inspect");
	return (
		<form
			onSubmit={event => {
				event.preventDefault();
				setResult(
					new FormData(event.currentTarget).get("lineNumbers")?.toString() ?? "omitted",
				);
			}}
		>
			<Checkbox
				label="Show line numbers"
				name="lineNumbers"
				value="include"
				defaultChecked
			/>
			<Button type="submit">Inspect form value</Button>
			<output>{result()}</output>
		</form>
	);
}
