import { createSignal } from "solid-js";
import { SegmentedControl, SegmentedControlItem } from "@codeui/kit";

export default function SegmentedControlDemo() {
	const [theme, setTheme] = createSignal("dark");
	return (
		<SegmentedControl value={theme()} onChange={setTheme}>
			<SegmentedControlItem value="light">Light</SegmentedControlItem>
			<SegmentedControlItem value="dark">Dark</SegmentedControlItem>
			<SegmentedControlItem value="system">System</SegmentedControlItem>
		</SegmentedControl>
	);
}
