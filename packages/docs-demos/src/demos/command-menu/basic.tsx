import { createMemo, createSignal } from "solid-js";
import { Button, type CommandItem, CommandMenu } from "@codeui/kit";

type Theme = { id: string; name: string; background: string; text: string; accent: string };

const themes: Theme[] = [
	{ id: "vercel", name: "Vercel", background: "#0a0a0a", text: "#ededed", accent: "#52a8ff" },
	{ id: "dracula", name: "Dracula", background: "#282a36", text: "#f8f8f2", accent: "#ff79c6" },
	{ id: "nord", name: "Nord", background: "#2e3440", text: "#d8dee9", accent: "#88c0d0" },
	{ id: "solarized", name: "Solarized light", background: "#fdf6e3", text: "#586e75", accent: "#b58900" },
];

type ThemeItem = CommandItem & { theme: Theme };

function Swatch(props: { theme: Theme }) {
	return (
		<span
			style={{
				width: "16px",
				height: "16px",
				"border-radius": "50%",
				background: `linear-gradient(135deg, ${props.theme.background} 50%, ${props.theme.accent} 50%)`,
				"box-shadow": "inset 0 0 0 1px rgb(127 127 127 / 35%)",
			}}
		/>
	);
}

export default function ThemePicker() {
	const [open, setOpen] = createSignal(false);
	const [applied, setApplied] = createSignal(themes[0]);
	const [preview, setPreview] = createSignal<Theme>();
	const [status, setStatus] = createSignal("");
	const shown = () => preview() ?? applied();

	const items = createMemo<ThemeItem[]>(() =>
		themes.map(theme => ({
			id: theme.id,
			textValue: theme.name,
			label: theme.name,
			group: "Themes",
			leading: <Swatch theme={theme} />,
			current: theme.id === applied().id,
			theme,
		})),
	);

	return (
		<div style={{ display: "grid", gap: "var(--cui-space-3)", "justify-items": "start" }}>
			<pre
				style={{
					margin: 0,
					padding: "var(--cui-space-4)",
					"border-radius": "var(--cui-radius-lg)",
					background: shown().background,
					color: shown().text,
					"font-size": "13px",
				}}
			>
				<span style={{ color: shown().accent }}>export function</span> greet(name) {"{"}
				{"\n"}
				{"  "}
				<span style={{ color: shown().accent }}>return</span> `Hello, ${"{"}name{"}"}`;{"\n"}
				{"}"}
			</pre>
			<Button variant="secondary" onClick={() => setOpen(true)}>
				Change theme
			</Button>
			<p aria-live="polite" style={{ margin: 0, color: "var(--cui-text-hint)" }}>
				{status()}
			</p>
			<CommandMenu
				open={open()}
				onOpenChange={setOpen}
				items={items()}
				title="Search themes"
				placeholder="Search themes"
				hint="↑↓ preview · ↵ apply · esc cancel"
				emptyContent="No theme matches"
				onHighlightChange={item => setPreview(item?.theme)}
				onBeforeClose={() => setPreview(undefined)}
				onCancel={() => setStatus(`Kept ${applied().name}`)}
				onSelect={item => {
					setApplied(item.theme);
					setStatus(`Applied ${item.theme.name}`);
				}}
			/>
		</div>
	);
}
