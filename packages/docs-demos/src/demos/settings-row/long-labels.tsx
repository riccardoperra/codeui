import { SettingsGroup, SettingsRow, Switch } from "@codeui/kit";
import "./settings-row.css";

export default function LongLabels() {
	return <div class="settings-row-demo-pane">
		<SettingsGroup title="Ein sehr langer Gruppentitel, der in schmalen Bereichen umbricht">
			<SettingsRow label="Bevorzugte Exportskalierung für hochauflösende Bildschirme" description="Die Skalierung bestimmt die Größe des exportierten Bildes in Pixeln, auch bei sehr langen Beschreibungen." compactControl>
				{control => <Switch {...control} />}
			</SettingsRow>
		</SettingsGroup>
	</div>;
}
