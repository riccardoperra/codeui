import { NumberField, SegmentedControl, SegmentedControlItem, SettingsGroup, SettingsRow, Switch } from "@codeui/kit";
import "./settings-row.css";

export default function Basic() {
	return <div class="settings-row-demo-pane">
		<SettingsGroup title="Interface">
			<SettingsRow label="Language" description="The language of the menus, labels and messages.">
				{control => <div class="settings-row-demo-segments" style={{ "--segments": 3 }}>
					<SegmentedControl {...control} defaultValue="en" size="sm" fluid>
						<SegmentedControlItem value="it">Italian</SegmentedControlItem>
						<SegmentedControlItem value="en">English</SegmentedControlItem>
						<SegmentedControlItem value="de">German</SegmentedControlItem>
					</SegmentedControl>
				</div>}
			</SettingsRow>
		</SettingsGroup>
		<SettingsGroup title="Sidebar">
			<SettingsRow label="Visible" description="Show the sidebar next to the canvas." compactControl>
				{control => <Switch {...control} defaultChecked />}
			</SettingsRow>
			<SettingsRow label="Padding" description="Space around the code.">
				{control => <NumberField {...control} defaultValue={64} size="sm" />}
			</SettingsRow>
		</SettingsGroup>
	</div>;
}
