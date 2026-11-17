import { SegmentedControl, SegmentedControlItem } from "@codeui/kit";
export default function Demo() {
	return (
		<div style={{ width: "100%", "min-height": "var(--cui-space-32)" }}>
			<SegmentedControl aria-label="Editor theme" defaultValue="dark" fluid autoWidth>
				<SegmentedControlItem value="light">Light</SegmentedControlItem>
				<SegmentedControlItem value="dark">Dark</SegmentedControlItem>
				<SegmentedControlItem value="system" disabled>
					System
				</SegmentedControlItem>
			</SegmentedControl>
		</div>
	);
}
