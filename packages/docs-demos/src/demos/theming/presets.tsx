import {
	Badge,
	Button,
	Checkbox,
	SegmentedControl,
	SegmentedControlItem,
	Switch,
	TextField,
} from "@codeui/kit";
import { createMemo, createSignal, For } from "solid-js";

type Mode = "dark" | "light";
type Overrides = Readonly<Record<`--cui-${string}`, string>>;

interface ThemePreset {
	readonly label: string;
	readonly shared: Overrides;
	readonly modes?: Readonly<Partial<Record<Mode, Overrides>>>;
}

const radii = (values: readonly string[]): Overrides =>
	Object.fromEntries(
		["badge", "xs", "sm", "nav", "md", "lg", "card", "xl", "command", "dialog"].map(
			(name, i) => [`--cui-radius-${name}`, values[i]],
		),
	);

const presets = {
	inkstone: { label: "Inkstone", shared: {} },
	square: {
		label: "Square",
		shared: radii(["2px", "2px", "3px", "3px", "4px", "4px", "6px", "6px", "8px", "8px"]),
	},
	soft: {
		label: "Soft",
		shared: radii([
			"10px",
			"10px",
			"12px",
			"14px",
			"18px",
			"20px",
			"22px",
			"24px",
			"28px",
			"32px",
		]),
	},
	forest: {
		label: "Forest",
		shared: {
			"--cui-action-brand-base": "#15803d",
			"--cui-action-brand-hover": "#146c34",
			"--cui-action-brand-active": "#125a2c",
			"--cui-action-brand-soft-base": "#15803d26",
			"--cui-action-brand-soft-hover": "#12602c26",
			"--cui-action-brand-soft-active": "#12602c26",
		},
		modes: {
			dark: {
				"--cui-action-brand-soft-text": "#4ade80",
				"--cui-accent-focus": "#4ade80",
				"--cui-accent-selection": "#15803d",
			},
			light: {
				"--cui-action-brand-soft-text": "#15803d",
				"--cui-accent-focus": "#16a34a",
				"--cui-accent-selection": "#16a34a",
			},
		},
	},
} satisfies Record<string, ThemePreset>;

type PresetId = keyof typeof presets;

const block = (selector: string, overrides: Overrides | undefined, indent = "") => {
	const entries = Object.entries(overrides ?? {});
	if (entries.length === 0) return [];
	return [
		`${indent}${selector} {`,
		...entries.map(([name, value]) => `${indent}\t${name}: ${value};`),
		`${indent}}`,
	];
};

/** The app.css shape from the Theming page: shared, light, dark, then system dark. */
function presetCss({ shared, modes }: ThemePreset): string {
	const darkSystem = block(":root:not([data-cui-theme])", modes?.dark, "\t");
	const sections = [
		block(":root,\n[data-cui-theme]", shared),
		block(':root:not([data-cui-theme]),\n[data-cui-theme="light"]', modes?.light),
		block('[data-cui-theme="dark"]', modes?.dark),
		darkSystem.length
			? ["@media (prefers-color-scheme: dark) {", ...darkSystem, "}"]
			: [],
	].filter(lines => lines.length > 0);
	return sections.length
		? sections.map(lines => lines.join("\n")).join("\n\n")
		: "/* Inkstone is the default. No overrides. */";
}

const scope = {
	display: "flex",
	"flex-direction": "column",
	gap: "var(--cui-space-3)",
	padding: "var(--cui-space-4)",
	"border-radius": "var(--cui-radius-card)",
	background: "var(--cui-surface-canvas)",
	color: "var(--cui-text-default)",
	flex: "1 1 260px",
} as const;

const code = {
	margin: 0,
	padding: "var(--cui-space-4)",
	"border-radius": "var(--cui-radius-card)",
	background: "var(--cui-surface-panel)",
	color: "var(--cui-text-default)",
	"font-family": "var(--cui-font-family-mono)",
	"font-size": "var(--cui-font-size-caption)",
	"line-height": "var(--cui-font-line-height-caption)",
	"max-height": "320px",
	overflow: "auto",
	"white-space": "pre",
} as const;

export default function ThemingPresets() {
	const [id, setId] = createSignal<PresetId>("inkstone");
	const [copied, setCopied] = createSignal(false);
	const preset = (): ThemePreset => presets[id()];
	const css = createMemo(() => presetCss(preset()));

	const copy = async () => {
		await navigator.clipboard.writeText(css());
		setCopied(true);
		setTimeout(() => setCopied(false), 1500);
	};

	return (
		<div
			style={{ display: "flex", "flex-direction": "column", gap: "var(--cui-space-4)" }}
		>
			<SegmentedControl
				aria-label="Theme preset"
				value={id()}
				onChange={value => setId(value as PresetId)}
			>
				<For each={Object.entries(presets)}>
					{([value, { label }]) => (
						<SegmentedControlItem value={value}>{label}</SegmentedControlItem>
					)}
				</For>
			</SegmentedControl>
			<div style={{ display: "flex", "flex-wrap": "wrap", gap: "var(--cui-space-3)" }}>
				<For each={["dark", "light"] as const}>
					{mode => (
						<div
							data-cui-theme={mode}
							style={{ ...scope, ...preset().shared, ...preset().modes?.[mode] }}
						>
							<TextField size="sm" label="Snippet name" placeholder="Untitled" />
							<Switch label="Show line numbers" defaultChecked />
							<Checkbox label="Transparent background" defaultChecked />
							<div
								style={{
									display: "flex",
									gap: "var(--cui-space-2)",
									"align-items": "center",
								}}
							>
								<Badge tone="success">Exported</Badge>
								<Badge>Draft</Badge>
							</div>
							<div style={{ display: "flex", gap: "var(--cui-space-2)" }}>
								<Button theme="primary" size="sm">
									Export PNG
								</Button>
								<Button theme="secondary" size="sm">
									Copy link
								</Button>
							</div>
						</div>
					)}
				</For>
			</div>
			<div
				style={{ display: "flex", "flex-direction": "column", gap: "var(--cui-space-2)" }}
			>
				<div style={{ display: "flex", "justify-content": "flex-end" }}>
					<Button theme="secondary" size="xs" onClick={copy}>
						{copied() ? "Copied" : "Copy CSS"}
					</Button>
				</div>
				<pre style={code}>{css()}</pre>
			</div>
		</div>
	);
}
