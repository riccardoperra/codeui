import { SegmentedControl, SegmentedControlItem, Button } from "@codeui/kit";
import { createSignal, For } from "solid-js";
export default function Demo() {
	const [value, setValue] = createSignal("dark");
	const [result, setResult] = createSignal("");
	return (
		<form
			onSubmit={event => {
				event.preventDefault();
				setResult(
					new FormData(event.currentTarget).get("theme")?.toString() ?? "omitted",
				);
			}}
		>
			<SegmentedControl aria-label="Editor theme" value={value()} onChange={setValue}>
				<SegmentedControlItem value="light">Light</SegmentedControlItem>
				<SegmentedControlItem value="dark">Dark</SegmentedControlItem>
				<SegmentedControlItem value="system" disabled>
					System
				</SegmentedControlItem>
			</SegmentedControl>
			<input type="hidden" name="theme" value={value()} />
			<Button type="submit">Inspect form value</Button>
			<output>{result()}</output>
		</form>
	);
}
