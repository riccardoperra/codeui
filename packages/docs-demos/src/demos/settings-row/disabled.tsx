import { SegmentedControl, SegmentedControlItem, SettingsGroup, SettingsRow, Switch } from "@codeui/kit";
import "./settings-row.css";

export default function Disabled() {
	return <div class="settings-row-demo-pane">
		<SettingsGroup title="Export">
			<SettingsRow label="Transparent background" description="Not available for JPEG." compactControl>
				{control => <Switch {...control} disabled />}
			</SettingsRow>
			<SettingsRow label="Format" description="The file type of the image.">
				{control => <div class="settings-row-demo-segments" style={{ "--segments": 3 }}>
					<SegmentedControl {...control} defaultValue="png" size="sm" disabled fluid>
						<SegmentedControlItem value="png">PNG</SegmentedControlItem>
						<SegmentedControlItem value="jpeg">JPEG</SegmentedControlItem>
						<SegmentedControlItem value="svg">SVG</SegmentedControlItem>
					</SegmentedControl>
				</div>}
			</SettingsRow>
		</SettingsGroup>
	</div>;
}
