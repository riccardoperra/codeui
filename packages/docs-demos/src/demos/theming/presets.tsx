import {
	Badge,
	Button,
	Checkbox,
	SegmentedControl,
	SegmentedControlItem,
	Slider,
	Switch,
	TextField,
} from "@codeui/kit";
import { createMemo, createSignal, For } from "solid-js";

interface Theme {
	readonly radiusScale: number;
	readonly brand: string;
}

const inkstone: Theme = { radiusScale: 1, brand: "#0099ff" };

const presets = {
	inkstone: { label: "Inkstone", theme: inkstone },
	square: { label: "Square", theme: { ...inkstone, radiusScale: 0.35 } },
	soft: { label: "Soft", theme: { ...inkstone, radiusScale: 1.5 } },
	forest: { label: "Forest", theme: { ...inkstone, brand: "#15803d" } },
} satisfies Record<string, { label: string; theme: Theme }>;

type PresetId = keyof typeof presets;

const sameTheme = (a: Theme, b: Theme) =>
	a.radiusScale === b.radiusScale && a.brand.toLowerCase() === b.brand.toLowerCase();

/** Only the values that differ from Inkstone. */
function overrides(theme: Theme): Record<`--cui-${string}`, string> {
	return {
		...(theme.radiusScale !== inkstone.radiusScale && {
			"--cui-radius-scale": String(theme.radiusScale),
		}),
		...(theme.brand !== inkstone.brand && { "--cui-action-brand-base": theme.brand }),
	};
}

function themeCss(theme: Theme): string {
	const entries = Object.entries(overrides(theme));
	if (entries.length === 0) return "/* Inkstone is the default. No overrides. */";
	return [":root {", ...entries.map(([name, value]) => `\t${name}: ${value};`), "}"].join(
		"\n",
	);
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
	overflow: "auto",
	"white-space": "pre",
} as const;

const row = {
	display: "flex",
	gap: "var(--cui-space-2)",
	"align-items": "center",
} as const;

export default function ThemingPresets() {
	const [theme, setTheme] = createSignal<Theme>(inkstone);
	const preset = createMemo(
		() =>
			(Object.keys(presets) as PresetId[]).find(id =>
				sameTheme(presets[id].theme, theme()),
			) ?? "custom",
	);
	const [copied, setCopied] = createSignal(false);
	const css = createMemo(() => themeCss(theme()));

	const pick = (id: PresetId) => setTheme(presets[id].theme);

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
				value={preset()}
				onChange={value => value in presets && pick(value as PresetId)}
			>
				<For each={Object.entries(presets)}>
					{([value, { label }]) => (
						<SegmentedControlItem value={value}>{label}</SegmentedControlItem>
					)}
				</For>
				<SegmentedControlItem value="custom" disabled>
					Custom
				</SegmentedControlItem>
			</SegmentedControl>
			<div style={{ ...row, "flex-wrap": "wrap", gap: "var(--cui-space-4)" }}>
				<div style={{ flex: "1 1 240px" }}>
					<Slider
						label="Radius scale"
						minValue={0}
						maxValue={2}
						step={0.05}
						value={theme().radiusScale}
						onChange={value => setTheme(t => ({ ...t, radiusScale: value }))}
						showValue
					/>
				</div>
				<label style={{ ...row, "font-size": "var(--cui-font-size-sm)" }}>
					<input
						type="color"
						value={theme().brand}
						onInput={event => setTheme(t => ({ ...t, brand: event.currentTarget.value }))}
					/>
					Brand color
				</label>
			</div>
			<div style={{ ...row, "flex-wrap": "wrap", "align-items": "stretch" }}>
				<For each={["dark", "light"] as const}>
					{mode => (
						<div data-cui-theme={mode} style={{ ...scope, ...overrides(theme()) }}>
							<TextField size="sm" label="Snippet name" placeholder="Untitled" />
							<Switch label="Show line numbers" defaultChecked />
							<Checkbox label="Transparent background" defaultChecked />
							<div style={row}>
								<Badge tone="success">Exported</Badge>
								<Badge>Draft</Badge>
							</div>
							<div style={row}>
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
