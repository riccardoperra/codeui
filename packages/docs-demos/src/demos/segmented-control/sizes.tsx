import { SegmentedControl, SegmentedControlItem } from "@codeui/kit";
export default function Demo() {
	return (
		<div style={{ display: "grid", gap: "var(--cui-space-4)" }}>
			<SegmentedControl aria-label="Editor theme (xs)" size="xs" defaultValue="dark">
				<SegmentedControlItem value="light">Light</SegmentedControlItem>
				<SegmentedControlItem value="dark">Dark</SegmentedControlItem>
				<SegmentedControlItem value="system" disabled>
					System
				</SegmentedControlItem>
			</SegmentedControl>
			<SegmentedControl aria-label="Editor theme (sm)" size="sm" defaultValue="dark">
				<SegmentedControlItem value="light">Light</SegmentedControlItem>
				<SegmentedControlItem value="dark">Dark</SegmentedControlItem>
				<SegmentedControlItem value="system" disabled>
					System
				</SegmentedControlItem>
			</SegmentedControl>
			<SegmentedControl aria-label="Editor theme (md)" size="md" defaultValue="dark">
				<SegmentedControlItem value="light">Light</SegmentedControlItem>
				<SegmentedControlItem value="dark">Dark</SegmentedControlItem>
				<SegmentedControlItem value="system" disabled>
					System
				</SegmentedControlItem>
			</SegmentedControl>
			<SegmentedControl aria-label="Editor theme (lg)" size="lg" defaultValue="dark">
				<SegmentedControlItem value="light">Light</SegmentedControlItem>
				<SegmentedControlItem value="dark">Dark</SegmentedControlItem>
				<SegmentedControlItem value="system" disabled>
					System
				</SegmentedControlItem>
			</SegmentedControl>
		</div>
	);
}
