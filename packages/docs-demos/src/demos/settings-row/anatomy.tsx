import { Badge, createSettingsRowProps, Switch } from "@codeui/kit";
import * as Settings from "@codeui/kit/settings/parts";

export default function SettingsRowAnatomy() {
	const row = createSettingsRowProps(() => ({ id: "anatomy-autosave", description: "Save every change as you type." }));
	return (
		<div style={{ width: "100%", "max-width": "440px" }}>
			<Settings.Group aria-labelledby="anatomy-editor-title" aria-describedby="anatomy-editor-description">
				<Settings.GroupTitle id="anatomy-editor-title">Editor</Settings.GroupTitle>
				<Settings.GroupDescription id="anatomy-editor-description">Applies to every snippet.</Settings.GroupDescription>
				<Settings.GroupContent>
					<Settings.Row {...row.root()}>
						<Settings.Picture>
							<svg viewBox="0 0 16 16" width="16" height="16" fill="none" stroke="currentColor" aria-hidden="true">
								<path d="M3 8.5l3 3 7-7" />
							</svg>
						</Settings.Picture>
						<Settings.Details>
							<Settings.Label {...row.label()}>
								Autosave
								<Settings.Marker>
									<Badge>New</Badge>
								</Settings.Marker>
							</Settings.Label>
							<Settings.Description {...row.description()}>Save every change as you type.</Settings.Description>
						</Settings.Details>
						<Settings.Control>
							<Switch {...row.control()} defaultChecked />
						</Settings.Control>
					</Settings.Row>
				</Settings.GroupContent>
			</Settings.Group>
		</div>
	);
}
