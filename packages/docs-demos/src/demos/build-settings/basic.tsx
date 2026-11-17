import {
	Button,
	OptionCardGroup,
	type OptionCardEntry,
	SegmentedControl,
	SegmentedControlItem,
	SettingsGroup,
	SettingsRow,
	type SettingsRowControlProps,
	Switch,
	TextField,
} from "@codeui/kit";
import * as Dialog from "@codeui/kit/dialog";
import { createMemo, createSignal, For, type JSX, Show } from "solid-js";
import { createStore } from "solid-js/store";
import { DownloadIcon, FlaskIcon, InfoIcon, PaletteIcon, ResetIcon, SlidersIcon, SparkleIcon } from "./icons";
import "./settings.css";

const defaults = {
	language: "en",
	colourMode: "dark",
	navigation: "accordion",
	panelSide: "right",
	format: "png",
	scale: "3",
	activeTab: false,
	releaseCard: true,
	takumi: false,
	layout: "sidebar",
	themeCards: "window",
};
type Values = typeof defaults;
type Choice = { [K in keyof Values]: Values[K] extends string ? K : never }[keyof Values];
type Toggle = { [K in keyof Values]: Values[K] extends boolean ? K : never }[keyof Values];
const experiments = ["takumi", "layout", "themeCards"] as const;

type Row = {
	id: string;
	label: string;
	description: string | ((values: Values) => string);
	/** Option cards take the full width of the row, under the text. */
	wide?: boolean;
	control: (control: SettingsRowControlProps) => JSX.Element;
};
type Group = { title: string; rows: Row[] };
type Section = { id: string; name: string; icon: () => JSX.Element; intro?: string; groups: Group[] };

export default function Settings() {
	const [values, setValues] = createStore({ ...defaults });

	// A segmented control is 84px per option in settings (Inkstone §6).
	const segmented = (key: Choice, options: [value: string, label: string][]) => (control: SettingsRowControlProps) => (
		<div style={{ width: `min(100%, ${options.length * 84}px)` }}>
			<SegmentedControl {...control} size="sm" fluid value={values[key]} onChange={value => setValues(key, value)}>
				<For each={options}>{([value, label]) => <SegmentedControlItem value={value}>{label}</SegmentedControlItem>}</For>
			</SegmentedControl>
		</div>
	);
	// Items are built per render, so a preview's DOM node is never shared between two rows.
	const cards = (key: Choice, items: () => OptionCardEntry[]) => (control: SettingsRowControlProps) => (
		<OptionCardGroup {...control} items={items()} value={values[key]} onChange={value => setValues(key, value)} />
	);
	const toggle = (key: Toggle) => (control: SettingsRowControlProps) => (
		<Switch {...control} checked={values[key]} onChange={checked => setValues(key, checked)} />
	);

	const sections: Section[] = [
		{ id: "general", name: "General", icon: SlidersIcon, groups: [
			{ title: "Interface", rows: [
				{ id: "language", label: "Language", description: "The language of the menus, labels and messages.",
					control: segmented("language", [["it", "Italian"], ["en", "English"], ["de", "German"], ["es", "Spanish"]]) },
			] },
		] },
		{ id: "appearance", name: "Appearance", icon: PaletteIcon, groups: [
			{ title: "Colours", rows: [
				{ id: "colour-mode", label: "Colour mode", description: "Dark, light, or the same as your system.", wide: true,
					control: cards("colourMode", () => [
						{ value: "dark", label: "Dark", badge: "Default", description: "Dark surfaces, easy on the eyes", preview: <Orb fill="#34365a" /> },
						{ value: "light", label: "Light", description: "Bright surfaces for daylight", preview: <Orb fill="#fdf3d8" /> },
						{ value: "system", label: "System", description: "Follows your device", preview: <Orb fill="#fdf3d8" half="#34365a" /> },
					]) },
			] },
			{ title: "Sidebar", rows: [
				{ id: "navigation", label: "Navigation", description: "How the sidebar moves between its sections.", wide: true,
					control: cards("navigation", () => [
						{ value: "accordion", label: "Accordion", badge: "Default", description: "One panel, one section open at a time", preview: <Panels rail={false} /> },
						{ value: "rail", label: "Rail", description: "An icon per section, each with its own panel", preview: <Panels rail /> },
					]) },
				{ id: "panel-side", label: "Panel side", description: "The side of the canvas the sidebar sits on.",
					control: segmented("panelSide", [["left", "Left"], ["right", "Right"]]) },
			] },
		] },
		{ id: "export", name: "Export", icon: DownloadIcon, intro: "What Export gives. The Export button uses these at once.", groups: [
			{ title: "Image", rows: [
				{ id: "format", label: "Format", description: "The file type of the image.",
					control: segmented("format", [["png", "PNG"], ["jpeg", "JPEG"], ["svg", "SVG"]]) },
				{ id: "scale", label: "Scale", description: v => `The image is ${593 * Number(v.scale)}×${469 * Number(v.scale)} pixels.`,
					control: segmented("scale", [["1", "1x"], ["2", "2x"], ["3", "3x"], ["6", "6x"]]) },
			] },
			{ title: "Tabs", rows: [
				{ id: "active-tab", label: "Show only active tab", description: "The window shows the active tab alone, without the other tabs.",
					control: toggle("activeTab") },
			] },
		] },
		{ id: "experiments", name: "Experiments", icon: FlaskIcon, intro: "Previews of what may come next. They can change or go away.", groups: [
			{ title: "Rendering engine", rows: [
				{ id: "takumi", label: "Takumi", description: "Use the experimental Takumi engine for image exports. Browser export is used if it fails.",
					control: toggle("takumi") },
			] },
			{ title: "Editor", rows: [
				{ id: "layout", label: "Layout", description: "Where the controls sit around the canvas. Sidebar is the default, Dock is an experiment.", wide: true,
					control: cards("layout", () => [
						{ value: "sidebar", label: "Sidebar", badge: "Default", description: "Every section beside the canvas", preview: <Canvas dock={false} /> },
						{ value: "dock", label: "Dock", description: "A dock floating over the canvas", preview: <Canvas dock /> },
					]) },
				{ id: "theme-cards", label: "Theme cards", description: "How the theme picker draws each theme. Window is the default, Orb and Aa list are experiments.", wide: true,
					control: cards("themeCards", () => [
						{ value: "window", label: "Window", badge: "Default", description: "A miniature of the window", preview: <ThemeWindow /> },
						{ value: "orb", label: "Orb", description: "One soft mark per theme", preview: <Orb fill="#7c5cff" half="#e0915c" /> },
						{ value: "list", label: "Aa list", description: "One compact row per theme", preview: <ThemeList /> },
					]) },
			] },
		] },
		{ id: "whats-new", name: "What's new", icon: SparkleIcon, groups: [
			{ title: "Announcements", rows: [
				{ id: "release-card", label: "Release card", description: "Show a card in the corner after an update.", control: toggle("releaseCard") },
			] },
		] },
		{ id: "about", name: "About", icon: InfoIcon, groups: [
			{ title: "CodeImage", rows: [
				{ id: "version", label: "Version", description: "The build you are running.", control: () => <span class="settings-demo-value">2.0.0</span> },
			] },
		] },
	];

	const [current, setCurrent] = createSignal("general");
	const [query, setQuery] = createSignal("");
	const section = () => sections.find(item => item.id === current()) ?? sections[0];
	const results = createMemo(() => {
		const terms = query().trim().toLowerCase();
		if (!terms) return [];
		return sections
			.map(item => ({
				title: item.name,
				rows: item.groups.flatMap(group => group.rows).filter(row => `${row.label} ${describe(row, values)}`.toLowerCase().includes(terms)),
			}))
			.filter(group => group.rows.length > 0);
	});
	const restore = () => experiments.forEach(key => setValues(key, defaults[key]));
	let content: HTMLDivElement | undefined;

	return (
		<Dialog.Root onOpenChange={open => !open && setQuery("")}>
			<Dialog.Trigger as={Button} theme="secondary" leftIcon={<SlidersIcon />}>
				Settings
			</Dialog.Trigger>
			<Dialog.Portal>
				<Dialog.Overlay />
				<Dialog.Positioner size="settings">
					<Dialog.Content
						ref={content}
						size="settings"
						chrome="inset"
						// Focus the section on screen, not the search, so a phone keyboard stays closed.
						onOpenAutoFocus={event => {
							event.preventDefault();
							content?.querySelector<HTMLElement>("[aria-current=page]")?.focus();
						}}
					>
						<Dialog.Sidebar
							search={<TextField size="sm" aria-label="Search settings" placeholder="Search settings" value={query()} onChange={setQuery} />}
						>
							<Dialog.Nav aria-label="Settings sections">
								<For each={sections}>
									{item => (
										<Dialog.NavItem
											icon={<item.icon />}
											current={!query() && current() === item.id}
											onClick={() => {
												setQuery("");
												setCurrent(item.id);
											}}
										>
											{item.name}
										</Dialog.NavItem>
									)}
								</For>
							</Dialog.Nav>
						</Dialog.Sidebar>
						<Dialog.Main>
							<Dialog.Header>
								<Dialog.Title class="settings-demo-crumbs">
									<span>Settings</span>
									<span aria-hidden="true">/</span>
									<span>{query() ? "Search" : section().name}</span>
								</Dialog.Title>
								<Dialog.CloseButton aria-label="Close settings" />
							</Dialog.Header>
							<Dialog.Body>
								<Show
									when={query()}
									fallback={
										<>
											<Show when={section().intro}>
												{intro => (
													<div class="settings-demo-intro">
														<p>{intro()}</p>
														<Show when={section().id === "experiments"}>
															<Button size="sm" theme="secondary" variant="ghost" leftIcon={<ResetIcon />} onClick={restore}>
																Restore defaults
															</Button>
														</Show>
													</div>
												)}
											</Show>
											<For each={section().groups}>
												{group => (
													<SettingsGroup title={group.title}>
														<Rows rows={group.rows} values={values} />
													</SettingsGroup>
												)}
											</For>
										</>
									}
								>
									<Show when={results().length > 0} fallback={<p class="settings-demo-empty" role="status">No settings match “{query().trim()}”.</p>}>
										<For each={results()}>
											{group => (
												<SettingsGroup title={group.title}>
													<Rows rows={group.rows} values={values} />
												</SettingsGroup>
											)}
										</For>
									</Show>
								</Show>
							</Dialog.Body>
						</Dialog.Main>
					</Dialog.Content>
				</Dialog.Positioner>
			</Dialog.Portal>
		</Dialog.Root>
	);
}

const describe = (row: Row, values: Values) => (typeof row.description === "function" ? row.description(values) : row.description);

function Rows(props: { rows: Row[]; values: Values }) {
	return (
		<For each={props.rows}>
			{row => (
				<SettingsRow id={`settings-${row.id}`} label={row.label} description={describe(row, props.values)} layout={row.wide ? "wide" : undefined}>
					{control => row.control(control)}
				</SettingsRow>
			)}
		</For>
	);
}

/* Option previews: a schematic in each option's own colours (Inkstone §9.4). */

function Orb(props: { fill: string; half?: string }) {
	return (
		<svg width="44" height="44" viewBox="0 0 44 44" aria-hidden="true">
			<circle cx="22" cy="22" r="18" fill={props.fill} />
			{props.half && <path d="M22 4a18 18 0 0 1 0 36z" fill={props.half} />}
			<circle cx="22" cy="22" r="18" fill="none" stroke="currentColor" stroke-opacity="0.18" />
		</svg>
	);
}

function Panels(props: { rail: boolean }) {
	return (
		<svg width="96" height="52" viewBox="0 0 96 52" aria-hidden="true">
			<rect x="10" y="6" width="44" height="40" rx="5" fill="currentColor" fill-opacity="0.14" />
			<rect x="20" y="17" width="24" height="18" rx="3" fill="currentColor" fill-opacity="0.3" />
			{props.rail ? (
				<>
					<rect x="60" y="6" width="18" height="40" rx="4" fill="#3b82c4" fill-opacity="0.55" />
					<rect x="81" y="6" width="5" height="40" rx="2.5" fill="#4aa8ff" />
				</>
			) : (
				<>
					<rect x="60" y="6" width="26" height="40" rx="4" fill="#3b82c4" fill-opacity="0.55" />
					<path d="M64 13h18M64 36h18M64 41h18" stroke="#9ad0ff" stroke-width="3" />
				</>
			)}
		</svg>
	);
}

function Canvas(props: { dock: boolean }) {
	return (
		<svg width="96" height="52" viewBox="0 0 96 52" aria-hidden="true">
			<rect x="6" y="6" width={props.dock ? 84 : 58} height="40" rx="5" fill="currentColor" fill-opacity="0.14" />
			<rect x={props.dock ? 30 : 18} y="14" width="34" height="18" rx="3" fill="#7c5cff" fill-opacity="0.7" />
			{props.dock ? (
				<rect x="26" y="37" width="44" height="6" rx="3" fill="currentColor" fill-opacity="0.45" />
			) : (
				<rect x="68" y="6" width="22" height="40" rx="4" fill="currentColor" fill-opacity="0.3" />
			)}
		</svg>
	);
}

function ThemeWindow() {
	return (
		<svg width="96" height="52" viewBox="0 0 96 52" aria-hidden="true">
			<rect x="14" y="4" width="68" height="44" rx="6" fill="#7c3aed" />
			<rect x="22" y="11" width="52" height="30" rx="4" fill="#16161a" />
			<path d="M28 20h18M28 27h28M28 34h12" stroke="#5eead4" stroke-width="3" stroke-linecap="round" />
		</svg>
	);
}

function ThemeList() {
	return (
		<svg width="96" height="52" viewBox="0 0 96 52" aria-hidden="true">
			<text x="26" y="34" font-size="18" font-weight="600" fill="currentColor">A</text>
			<text x="44" y="34" font-size="18" font-weight="600" fill="currentColor" fill-opacity="0.55">a</text>
		</svg>
	);
}
