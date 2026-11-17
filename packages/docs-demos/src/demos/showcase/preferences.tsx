import { Combobox, fieldLabelStyles, NumberField, SegmentedControl, SegmentedControlItem, Slider } from "@codeui/kit";
import "./showcase.css";

const zones = ["Europe/Rome", "Europe/London", "America/New_York", "America/Los_Angeles", "Asia/Tokyo", "Australia/Sydney"];

export default function Preferences() {
	return (
		<div class="showcase-stack">
			<div class="showcase-field" data-field-size="md">
				<span id="showcase-preferences-theme" class={fieldLabelStyles.label}>
					Appearance
				</span>
				<SegmentedControl aria-labelledby="showcase-preferences-theme" defaultValue="system" fluid>
					<SegmentedControlItem value="light">Light</SegmentedControlItem>
					<SegmentedControlItem value="dark">Dark</SegmentedControlItem>
					<SegmentedControlItem value="system">System</SegmentedControlItem>
				</SegmentedControl>
			</div>
			<Slider label="Text size" minValue={80} maxValue={150} step={10} defaultValue={100} showValue getValueLabel={({ values }) => `${values[0]}%`} />
			<Combobox size="sm" label="Time zone" placeholder="Search time zones" options={zones} defaultValue="Europe/Rome" />
			<NumberField size="sm" label="Sign out after" postfix=" min" min={5} max={240} step={5} defaultValue={30} />
		</div>
	);
}
