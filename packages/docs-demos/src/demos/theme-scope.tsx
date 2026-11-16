import { Button, TextField } from "@codeui/kit";

const scope = {
	display: "flex",
	"flex-direction": "column",
	gap: "12px",
	padding: "16px",
	"border-radius": "var(--cui-radius-card)",
	background: "var(--cui-surface-panel)",
	"min-width": "220px",
} as const;

export default function ThemeScopeDemo() {
	return (
		<>
			<div data-cui-theme="dark" style={scope}>
				<TextField size="sm" label="Snippet name" placeholder="Untitled" />
				<Button theme="primary" size="sm">
					Export
				</Button>
			</div>
			<div data-cui-theme="light" style={scope}>
				<TextField size="sm" label="Snippet name" placeholder="Untitled" />
				<Button theme="primary" size="sm">
					Export
				</Button>
			</div>
			<div
				style={{
					...scope,
					"--cui-action-brand-base": "#7c3aed",
					"--cui-action-brand-hover": "#6d28d9",
					"--cui-action-brand-active": "#5b21b6",
					"--cui-radius-sm": "4px",
					"--cui-radius-md": "4px",
				}}
			>
				<TextField size="sm" label="Snippet name" placeholder="Untitled" />
				<Button theme="primary" size="sm">
					Export
				</Button>
			</div>
		</>
	);
}
