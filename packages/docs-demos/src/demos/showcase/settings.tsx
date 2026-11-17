import { SettingsRow, Switch } from "@codeui/kit";
import "./showcase.css";

export default function Notifications() {
	const classes = { root: "showcase-settings-row" };
	return (
		<div>
			<SettingsRow classes={classes} label="Email" description="A summary of the day's activity." compactControl>
				{control => <Switch {...control} defaultChecked />}
			</SettingsRow>
			<SettingsRow classes={classes} label="Push" description="Mentions and direct messages." compactControl>
				{control => <Switch {...control} defaultChecked />}
			</SettingsRow>
			<SettingsRow classes={classes} label="Sounds" description="A short tone for each message." compactControl>
				{control => <Switch {...control} />}
			</SettingsRow>
		</div>
	);
}
