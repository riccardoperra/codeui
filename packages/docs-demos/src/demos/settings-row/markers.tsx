import { Badge, Button, SettingsGroup, SettingsRow, Switch } from "@codeui/kit";
import "./settings-row.css";

export default function Markers() {
	return <div class="settings-row-demo-pane">
		<SettingsGroup title="Local AI" description="Choices that are not the default yet.">
			<SettingsRow label="Takumi" marker={<Badge>Experimental</Badge>} description="Use the experimental Takumi engine for image exports." compactControl>
				{control => <Switch {...control} />}
			</SettingsRow>
			<SettingsRow
				label="On-device model"
				marker={<Badge tone="success">New</Badge>}
				description="Chrome downloads it once, a few GB."
				details="Chrome 148 or later, on a computer."
				picture={<svg width="104" height="64" viewBox="0 0 104 64" aria-hidden="true"><rect width="104" height="64" rx="10" fill="var(--cui-surface-input)" /><path d="M20 22h64M20 34h40M20 46h52" stroke="var(--cui-text-muted)" stroke-width="4" /></svg>}
			>
				{control => <Button aria-describedby={control["aria-labelledby"]} variant="secondary" size="sm">Download</Button>}
			</SettingsRow>
		</SettingsGroup>
	</div>;
}
