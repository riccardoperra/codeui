import { Button, SegmentedControl, SegmentedControlItem, Switch, TextField } from "@codeui/kit";
import * as Dialog from "@codeui/kit/dialog";
import { createMemo, createSignal, For, type JSX, Show } from "solid-js";
import { DownloadIcon, FlaskIcon, InfoIcon, PaletteIcon, SlidersIcon, SparkleIcon } from "./icons";
import "./settings.css";

type Row = { id: string; title: string; description: string; control: () => JSX.Element };
type Group = { title: string; rows: Row[] };
type Section = { id: string; name: string; icon: () => JSX.Element; groups: Group[] };

const segmented = (label: string, value: string, options: string[]) => () => (
	<SegmentedControl size="sm" aria-label={label} defaultValue={value}>
		<For each={options}>{option => <SegmentedControlItem value={option}>{option}</SegmentedControlItem>}</For>
	</SegmentedControl>
);
const toggle = (label: string, on = false) => () => <Switch aria-label={label} defaultChecked={on} />;

const sections: Section[] = [
	{ id: "general", name: "General", icon: SlidersIcon, groups: [
		{ title: "Interface", rows: [
			{ id: "language", title: "Language", description: "The language of the menus, labels and messages.",
				control: segmented("Language", "English", ["Italian", "English", "German", "Spanish"]) },
		] },
	] },
	{ id: "appearance", name: "Appearance", icon: PaletteIcon, groups: [
		{ title: "Theme", rows: [
			{ id: "mode", title: "Colour mode", description: "Dark, light, or the system setting.",
				control: segmented("Colour mode", "Dark", ["Dark", "Light", "System"]) },
			{ id: "reduce", title: "Reduce motion", description: "Fade overlays instead of moving them.", control: toggle("Reduce motion") },
		] },
	] },
	{ id: "export", name: "Export", icon: DownloadIcon, groups: [
		{ title: "Defaults", rows: [
			{ id: "scale", title: "Scale", description: "The size of saved images.", control: segmented("Scale", "2x", ["1x", "2x", "3x", "6x"]) },
			{ id: "transparent", title: "Transparent background", description: "Keep the area outside the frame clear.",
				control: toggle("Transparent background", true) },
		] },
	] },
	{ id: "experiments", name: "Experiments", icon: FlaskIcon, groups: [
		{ title: "Editor", rows: [
			{ id: "ligatures", title: "Font ligatures", description: "Join characters such as => into one glyph.", control: toggle("Font ligatures") },
		] },
	] },
	{ id: "whats-new", name: "What's new", icon: SparkleIcon, groups: [
		{ title: "Announcements", rows: [
			{ id: "corner", title: "Release card", description: "Show a card in the corner after an update.", control: toggle("Release card", true) },
		] },
	] },
	{ id: "about", name: "About", icon: InfoIcon, groups: [
		{ title: "CodeImage", rows: [
			{ id: "version", title: "Version", description: "The build you are running.", control: () => <span class="settings-demo-value">2.4.0</span> },
		] },
	] },
];

function Rows(props: { rows: Row[] }) {
	return (
		<For each={props.rows}>
			{row => (
				// A local row until SettingsRow ships: title and description, control on the right.
				<div class="settings-demo-row" role="group" aria-label={row.title}>
					<div class="settings-demo-row-text">
						<span class="settings-demo-row-title">{row.title}</span>
						<span class="settings-demo-row-description">{row.description}</span>
					</div>
					{row.control()}
				</div>
			)}
		</For>
	);
}

export default function Settings() {
	const [current, setCurrent] = createSignal("general");
	const [query, setQuery] = createSignal("");
	const section = () => sections.find(item => item.id === current()) ?? sections[0];
	const results = createMemo(() => {
		const terms = query().trim().toLowerCase();
		if (!terms) return [];
		return sections
			.map(item => ({ title: item.name, rows: item.groups.flatMap(group => group.rows).filter(row => `${row.title} ${row.description}`.toLowerCase().includes(terms)) }))
			.filter(group => group.rows.length > 0);
	});
	let content: HTMLDivElement | undefined;

	return (
		<Dialog.Root onOpenChange={open => !open && setQuery("")}>
			<Dialog.Trigger as={Button} theme="secondary">Open settings</Dialog.Trigger>
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
									<span class="settings-demo-crumb-root">Settings</span>
									<span class="settings-demo-crumb-slash" aria-hidden="true">/</span>
									<span>{query() ? "Search" : section().name}</span>
								</Dialog.Title>
								<Dialog.CloseButton aria-label="Close settings" />
							</Dialog.Header>
							<Dialog.Body>
								<Show
									when={query()}
									fallback={<For each={section().groups}>{group => <Dialog.Section title={group.title}><Rows rows={group.rows} /></Dialog.Section>}</For>}
								>
									<Show when={results().length > 0} fallback={<p class="settings-demo-empty" role="status">No settings match “{query().trim()}”.</p>}>
										<For each={results()}>{group => <Dialog.Section title={group.title}><Rows rows={group.rows} /></Dialog.Section>}</For>
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
