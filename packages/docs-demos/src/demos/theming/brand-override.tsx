import { Button, Switch } from "@codeui/kit";
import { For } from "solid-js";
import "./brand-override.css";

const scope = {
	display: "flex",
	"flex-direction": "column",
	gap: "var(--cui-space-3)",
	padding: "var(--cui-space-4)",
	"border-radius": "var(--cui-radius-card)",
	background: "var(--cui-surface-canvas)",
	color: "var(--cui-text-default)",
	"min-width": "220px",
} as const;

export default function ThemingBrandOverride() {
	return (
		<div class="docs-brand" style={{ display: "flex", "flex-wrap": "wrap", gap: "var(--cui-space-3)" }}>
			<For each={["dark", "light"] as const}>
				{mode => (
					<div data-cui-theme={mode} style={scope}>
						<Switch label="Show line numbers" defaultChecked />
						<Button theme="primary" size="sm">
							Export PNG
						</Button>
						<Button theme="negative" size="sm" class="delete-snippet">
							Delete snippet
						</Button>
					</div>
				)}
			</For>
		</div>
	);
}
