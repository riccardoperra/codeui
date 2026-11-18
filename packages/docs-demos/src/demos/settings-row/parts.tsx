import { Badge, createSettingsRowProps, Switch } from "@codeui/kit";
import * as Settings from "@codeui/kit/settings/parts";
import "./settings-row.css";

export default function Parts() {
	const row = createSettingsRowProps(() => ({ id: "parts-autosave", description: "Save every change as you type." }));
	return <div class="settings-row-demo-pane">
		<Settings.Group aria-labelledby="parts-editor-title">
			<Settings.GroupTitle id="parts-editor-title">Editor</Settings.GroupTitle>
			<Settings.GroupContent>
				<Settings.Row {...row.root()} compactControl>
					<Settings.Label {...row.label()}>Autosave<Settings.Marker><Badge>New</Badge></Settings.Marker></Settings.Label>
					<Settings.Description {...row.description()}>Save every change as you type.</Settings.Description>
					<Settings.Control><Switch {...row.control()} defaultChecked /></Settings.Control>
				</Settings.Row>
			</Settings.GroupContent>
		</Settings.Group>
	</div>;
}
