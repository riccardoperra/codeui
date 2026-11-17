import { SegmentedControl, SegmentedControlItem } from "@codeui/kit";

export default function SegmentedControlAnatomy() {
	return (
		<SegmentedControl aria-label="Editor theme" defaultValue="dark">
			<SegmentedControlItem value="light">Light</SegmentedControlItem>
			<SegmentedControlItem value="dark">Dark</SegmentedControlItem>
			<SegmentedControlItem value="system">System</SegmentedControlItem>
		</SegmentedControl>
	);
}
