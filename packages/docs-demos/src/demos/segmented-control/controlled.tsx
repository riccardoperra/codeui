import { SegmentedControl, SegmentedControlItem } from "@codeui/kit";
import { createSignal } from "solid-js";
export default function Demo() {
	const [value, setValue] = createSignal("dark");
	return (
		<SegmentedControl aria-label="Editor theme" value={value()} onChange={setValue}>
			<SegmentedControlItem value="light">Light</SegmentedControlItem>
			<SegmentedControlItem value="dark">Dark</SegmentedControlItem>
			<SegmentedControlItem value="system" disabled>
				System
			</SegmentedControlItem>
		</SegmentedControl>
	);
}
