import { SegmentedControl, SegmentedControlItem, SettingsGroup, SettingsRow, Switch } from "@codeui/kit";
import "./settings-row.css";

export default function CompactControl() {
	return <div class="settings-row-demo-pane">
		<SettingsGroup title="Tabs">
			<SettingsRow label="Show only active tab" description="The window shows the active tab alone." compactControl>
				{control => <Switch {...control} />}
			</SettingsRow>
			<SettingsRow label="Panel side" description="The side of the canvas the sidebar sits on.">
				{control => <div class="settings-row-demo-segments" style={{ "--segments": 2 }}>
					<SegmentedControl {...control} defaultValue="left" size="sm" fluid>
						<SegmentedControlItem value="left">Left</SegmentedControlItem>
						<SegmentedControlItem value="right">Right</SegmentedControlItem>
					</SegmentedControl>
				</div>}
			</SettingsRow>
		</SettingsGroup>
	</div>;
}
