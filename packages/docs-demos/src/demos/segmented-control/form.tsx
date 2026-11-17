import { SegmentedControl, SegmentedControlItem, Button, Stack, Text } from "@codeui/kit";
import { createSignal } from "solid-js";
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
			<Stack gap="3" align="start">
				<SegmentedControl aria-label="Editor theme" value={value()} onChange={setValue}>
					<SegmentedControlItem value="light">Light</SegmentedControlItem>
					<SegmentedControlItem value="dark">Dark</SegmentedControlItem>
					<SegmentedControlItem value="system" disabled>
						System
					</SegmentedControlItem>
				</SegmentedControl>
				<input type="hidden" name="theme" value={value()} />
				<Stack direction="row" gap="3" align="center" wrap>
					<Button type="submit" size="sm">
						Inspect form value
					</Button>
					<Text as="output" size="caption" tone="muted">
						{result()}
					</Text>
				</Stack>
			</Stack>
		</form>
	);
}
