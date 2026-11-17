import { Button, Switch, TextField } from "@codeui/kit";
import { For } from "solid-js";

const scope = {
	display: "flex",
	"flex-direction": "column",
	gap: "var(--cui-space-3)",
	padding: "var(--cui-space-4)",
	"border-radius": "var(--cui-radius-card)",
	background: "var(--cui-surface-canvas)",
	color: "var(--cui-text-default)",
	"min-width": "240px",
} as const;

export default function ThemingModes() {
	return (
		<For each={["dark", "light"] as const}>
			{mode => (
				<div data-cui-theme={mode} style={scope}>
					<TextField size="sm" label="Snippet name" placeholder="Untitled" />
					<Switch label="Show line numbers" defaultChecked />
					<Button theme="primary" size="sm">
						Export PNG
					</Button>
				</div>
			)}
		</For>
	);
}
