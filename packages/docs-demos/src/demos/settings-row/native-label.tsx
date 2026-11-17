import { SettingsGroup, SettingsRow, TextField } from "@codeui/kit";
import "./settings-row.css";

export default function NativeLabel() {
	return <div class="settings-row-demo-pane">
		<SettingsGroup title="Export">
			<SettingsRow label="File name" description="Used when you save the image." controlId="export-file-name-input">
				{control => <TextField {...control} id="export-file-name" defaultValue="snippet.png" size="sm" />}
			</SettingsRow>
		</SettingsGroup>
	</div>;
}
