import { OptionCardGroup, SettingsGroup, SettingsRow } from "@codeui/kit";
import "./settings-row.css";

export default function Wide() {
	return <div class="settings-row-demo-pane">
		<SettingsGroup title="Colours">
			<SettingsRow label="Colour mode" description="Dark, light, or the same as your system." layout="wide">
				{control => <OptionCardGroup aria-labelledby={control["aria-labelledby"]} defaultValue="dark" items={[
					{ value: "dark", label: "Dark", description: "Dark surfaces", badge: "Default" },
					{ value: "light", label: "Light", description: "Light surfaces" },
					{ value: "system", label: "System", description: "Follow your device" },
				]} />}
			</SettingsRow>
		</SettingsGroup>
	</div>;
}
