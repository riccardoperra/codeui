import { For } from "solid-js";

const swatches = [
	"surface-canvas",
	"surface-panel",
	"surface-input",
	"surface-dialog",
	"text-default",
	"text-muted",
	"action-brand-base",
	"action-neutral-base",
	"action-success-base",
	"action-caution-base",
	"action-danger-base",
	"accent-focus",
];

function Mode(props: { mode: "dark" | "light" }) {
	return (
		<section
			data-cui-theme={props.mode}
			aria-label={`${props.mode} mode`}
			style={{
				flex: "1 1 240px",
				display: "grid",
				"grid-template-columns": "repeat(auto-fill, minmax(104px, 1fr))",
				gap: "var(--cui-space-3)",
				padding: "var(--cui-space-4)",
				"border-radius": "var(--cui-radius-card)",
				background: "var(--cui-surface-canvas)",
				color: "var(--cui-text-default)",
			}}
		>
			<For each={swatches}>
				{name => (
					<div style={{ display: "grid", gap: "var(--cui-space-1-5)" }}>
						<span
							style={{
								height: "40px",
								"border-radius": "var(--cui-radius-sm)",
								background: `var(--cui-${name})`,
								"box-shadow": "inset 0 0 0 1px #8888884d",
							}}
						/>
						<code style={{ "font-family": "var(--cui-font-family-mono)", "font-size": "var(--cui-font-size-xs)", "overflow-wrap": "anywhere" }}>
							{name}
						</code>
					</div>
				)}
			</For>
		</section>
	);
}

export default function TokensOverview() {
	return (
		<div style={{ display: "flex", "flex-wrap": "wrap", gap: "var(--cui-space-3)" }}>
			<Mode mode="dark" />
			<Mode mode="light" />
		</div>
	);
}
