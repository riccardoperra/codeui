import {
	Button,
	type CommandItem,
	CommandMenu,
	createToaster,
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuPortal,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
	DropdownSubMenu,
	DropdownSubMenuContent,
	DropdownSubMenuTrigger,
	IconButton,
	Kbd,
	SegmentedControl,
	SegmentedControlItem,
	Sheet,
	Toaster,
	Tooltip,
} from "@codeui/kit";
import ChevronDown from "@lucide/solid/icons/chevron-down";
import ChevronRight from "@lucide/solid/icons/chevron-right";
import Copy from "@lucide/solid/icons/copy";
import Download from "@lucide/solid/icons/download";
import FileBraces from "@lucide/solid/icons/file-braces";
import FileInput from "@lucide/solid/icons/file-input";
import GalleryVertical from "@lucide/solid/icons/gallery-vertical";
import Palette from "@lucide/solid/icons/palette";
import Redo from "@lucide/solid/icons/redo-2";
import RotateCcw from "@lucide/solid/icons/rotate-ccw";
import Search from "@lucide/solid/icons/search";
import SlidersHorizontal from "@lucide/solid/icons/sliders-horizontal";
import SwatchBook from "@lucide/solid/icons/swatch-book";
import Undo from "@lucide/solid/icons/undo-2";
import { createSignal, For, onSettled, Show } from "solid-js";
import { type JSX } from "@solidjs/web";
import { ExampleMenu } from "../shared/ExampleMenu";
import { modKey, onModK } from "../shared/hotkey";
import { createIsPhone } from "../shared/media";
import { createControlSize } from "../shared/size";
import { setTheme, theme, type Theme as Interface } from "../shared/theme";
import { exportButtonId, ExportDialog, ImportDialog } from "./ExportDialog";
import type { LanguageId } from "./highlight";
import { Panel, PanelTabs } from "./Panel";
import { Stage } from "./Preview";
import { presets } from "./presets";
import { findSample, samples } from "./samples";
import { createStudio, StudioContext, useStudio, type View } from "./studio";
import { printColor, readBackdrop, slotColor, type SlotKey, slotLabel, slots } from "./theme";

/** A command that changes a value previews it while highlighted. `run` commits, Escape restores. */
type Command = CommandItem & { preview?: () => void; run: () => void };

const shortcut = { undo: `${modKey()}Z`, redo: `⇧${modKey()}Z`, commands: `${modKey()}K` };

/** The name of an icon button, with its shortcut when it has one. */
function Tip(props: { label: string; keys?: string; placement?: "top" | "bottom"; children: JSX.Element }) {
	return (
		// The kit's default tooltip is filled with the accent. A name is not a signal, so these are neutral.
		<Tooltip
			variant="secondary"
			placement={props.placement ?? "top"}
			content={
				<span class="ts-tip">
					{props.label}
					<Show when={props.keys}>
						<Kbd>{props.keys}</Kbd>
					</Show>
				</span>
			}
		>
			{props.children}
		</Tooltip>
	);
}

/** The theme's label is the title: text until it is hovered or focused, then a field. */
function Name() {
	const studio = useStudio();
	let before = "";
	return (
		// The label's hidden copy of the text gives the input its width, so the title is as wide as its name.
		<label class="ts-name" data-value={studio.theme().label || "Untitled"}>
			<span class="ex-sr-only">Theme label</span>
			<input
				size={1}
				spellcheck={false}
				autocomplete="off"
				placeholder="Untitled"
				value={studio.theme().label}
				onFocus={() => (before = studio.saved().label)}
				onInput={event => studio.setLabel(event.currentTarget.value)}
				onBlur={() => studio.saved().label.trim() || studio.setLabel("Untitled")}
				onKeyDown={event => {
					if (event.key === "Escape") studio.setLabel(before);
					if (event.key === "Escape" || event.key === "Enter") event.currentTarget.blur();
				}}
			/>
		</label>
	);
}

const swatch = (fill: string) => <span class="ts-chip" style={{ background: fill }} />;

/** One export control: the action, and a menu of the other ways in and out (DESIGN.md §2.5). */
function ExportControl() {
	const studio = useStudio();
	const size = createControlSize();
	const isPhone = createIsPhone();
	return (
		<div class="ts-split" role="group" aria-label="Export">
			<Show
				when={!isPhone()}
				fallback={
					<IconButton id={exportButtonId} class="ts-split-start" variant="primary" size={size()} aria-label="Export" onClick={() => studio.setExportOpen(true)}>
						<Download size={16} />
					</IconButton>
				}
			>
				<Button id={exportButtonId} class="ts-split-start" variant="primary" size={size()} leftIcon={<Download size={16} />} onClick={() => studio.setExportOpen(true)}>
					Export
				</Button>
			</Show>
			<DropdownMenu placement="bottom-end">
				<Tip label="Copy, import, start over" placement="bottom">
					<DropdownMenuTrigger as={IconButton} class="ts-split-end" variant="primary" size={size()} aria-label="More ways to export and import">
						<ChevronDown size={16} />
					</DropdownMenuTrigger>
				</Tip>
				<DropdownMenuPortal>
					<DropdownMenuContent>
						<DropdownMenuItem onSelect={() => studio.copy("ts")}>
							<span class="ex-menu-icon">
								<Copy size={16} />
							</span>
							Copy TypeScript
						</DropdownMenuItem>
						<DropdownMenuItem onSelect={() => studio.download("ts")}>
							<span class="ex-menu-icon">
								<Download size={16} />
							</span>
							Download .ts
						</DropdownMenuItem>
						<DropdownMenuItem onSelect={() => studio.copy("json")}>
							<span class="ex-menu-icon">
								<FileBraces size={16} />
							</span>
							Copy JSON
						</DropdownMenuItem>
						<DropdownMenuSeparator />
						<DropdownMenuItem onSelect={() => studio.setImportOpen(true)}>
							<span class="ex-menu-icon">
								<FileInput size={16} />
							</span>
							Import theme…
						</DropdownMenuItem>
						<DropdownSubMenu>
							<DropdownSubMenuTrigger rightSlot={<ChevronRight size={16} />}>
								<span class="ex-menu-icon">
									<SwatchBook size={16} />
								</span>
								Start from
							</DropdownSubMenuTrigger>
							<DropdownMenuPortal>
								<DropdownSubMenuContent>
									<For each={presets}>
										{preset => (
											<DropdownMenuItem onSelect={() => studio.startFrom(preset.id)}>
												<span class="ex-menu-icon">{swatch(preset.previewBackground)}</span>
												{preset.label}
											</DropdownMenuItem>
										)}
									</For>
								</DropdownSubMenuContent>
							</DropdownMenuPortal>
						</DropdownSubMenu>
						<DropdownMenuSeparator />
						<DropdownMenuItem disabled={studio.isOrigin()} onSelect={studio.reset}>
							<span class="ex-menu-icon">
								<RotateCcw size={16} />
							</span>
							Reset to {studio.origin().label}
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenuPortal>
			</DropdownMenu>
		</div>
	);
}

/** Floats over the content island and takes no layout space (DESIGN.md §8). It steps aside for the command menu, which opens in its place. */
function Toolbar(props: { hidden: boolean }) {
	const studio = useStudio();
	const size = createControlSize();
	const isPhone = createIsPhone();
	const button = { theme: "secondary", pill: true } as const;
	const card = () => studio.view() === "card";
	return (
		<div class="ts-toolbar" role="toolbar" aria-label="Preview" hidden={props.hidden}>
			<Show
				when={!isPhone()}
				fallback={
					// Seven segments do not fit a phone. The same choice is a menu there.
					<DropdownMenu placement="top-start">
						<DropdownMenuTrigger as={Button} {...button} ghost size={size()} aria-label={`Sample: ${findSample(studio.sample()).name}`}>
							{findSample(studio.sample()).name}
							<ChevronDown size={16} />
						</DropdownMenuTrigger>
						<DropdownMenuPortal>
							<DropdownMenuContent>
								<For each={samples}>{sample => <DropdownMenuItem onSelect={() => studio.setSample(sample.id)}>{sample.name}</DropdownMenuItem>}</For>
							</DropdownMenuContent>
						</DropdownMenuPortal>
					</DropdownMenu>
				}
			>
				{/* A file extension per sample: seven names would not fit, and the tab of the window spells the file out. */}
				<SegmentedControl aria-label="Sample" size={size()} value={studio.sample()} onChange={value => studio.setSample(value as LanguageId)}>
					<For each={samples}>
						{sample => (
							<SegmentedControlItem value={sample.id} aria-label={sample.name}>
								.{sample.id}
							</SegmentedControlItem>
						)}
					</For>
				</SegmentedControl>
			</Show>
			<span class="ts-toolbar-group">
				<Tip label="Undo" keys={shortcut.undo}>
					<IconButton {...button} ghost size={size()} aria-label="Undo" disabled={!studio.canUndo()} onClick={studio.undo}>
						<Undo size={16} />
					</IconButton>
				</Tip>
				<Tip label="Redo" keys={shortcut.redo}>
					<IconButton {...button} ghost size={size()} aria-label="Redo" disabled={!studio.canRedo()} onClick={studio.redo}>
						<Redo size={16} />
					</IconButton>
				</Tip>
			</span>
			<Tip label={card() ? "Show the frame" : "Show the theme card"}>
				{/* "On" is a step of fill, not the accent: this is a view, not a signal (DESIGN.md §2.3). */}
				<IconButton {...button} ghost={!(card())} size={size()} aria-label="Theme card" aria-pressed={card() ? "true" : "false"} onClick={() => studio.setView(card() ? "frame" : "card")}>
					<GalleryVertical size={16} />
				</IconButton>
			</Tip>
		</div>
	);
}

export function App() {
	const notifications = createToaster();
	const studio = createStudio(notifications);
	const isPhone = createIsPhone();
	const size = createControlSize();
	const [commandsOpen, setCommandsOpen] = createSignal(false);

	/**
	 * "Edit keywords…" opens that row's picker. The menu gives focus back as it closes, which would
	 * close a picker opened before that, so the picker waits and takes the focus in the menu's place.
	 */
	let editing: SlotKey | null = null;
	const edit = (key: SlotKey) => {
		studio.reveal(key);
		editing = key;
	};
	const openEditing = (event: Event) => {
		if (!editing) return;
		event.preventDefault();
		studio.setPicker(editing);
		editing = null;
	};

	// Read from the same data as the panel's controls, so the menu lists every option they offer.
	const commands = (): Command[] => {
		const now = studio.saved();
		const action = (id: string, label: string, run: () => void, keys?: string, disabled?: boolean): Command => ({ id, textValue: label, label, group: "Actions", shortcut: keys, disabled, run });
		const colors: SlotKey[] = [...readBackdrop(now.previewBackground).stops.map((_, index) => `previewBackground.${index}` as SlotKey), ...slots.map(item => item.key)];
		return [
			action("export", "Export…", () => studio.setExportOpen(true)),
			action("copy-ts", "Copy TypeScript", () => studio.copy("ts")),
			action("download-ts", "Download .ts", () => studio.download("ts")),
			action("copy-json", "Copy JSON", () => studio.copy("json")),
			action("import", "Import theme…", () => studio.setImportOpen(true)),
			action("undo", "Undo", studio.undo, shortcut.undo, !studio.canUndo()),
			action("redo", "Redo", studio.redo, shortcut.redo, !studio.canRedo()),
			action("reset", `Reset to ${studio.origin().label}`, studio.reset, undefined, studio.isOrigin()),
			...presets.map<Command>(preset => ({
				id: `start-${preset.id}`,
				textValue: `Start from ${preset.label}`,
				label: `Start from ${preset.label}`,
				group: "Start from",
				current: studio.originId() === preset.id,
				leading: swatch(preset.previewBackground),
				preview: () => studio.setPreview(preset),
				run: () => studio.startFrom(preset.id),
			})),
			...[true, false].map<Command>(darkMode => ({
				id: `mode-${darkMode}`,
				textValue: darkMode ? "Dark mode theme" : "Light mode theme",
				label: darkMode ? "Dark mode" : "Light mode",
				group: "Theme",
				current: now.darkMode === darkMode,
				preview: () => studio.setPreview({ ...now, darkMode }),
				run: () => studio.patch({ darkMode }),
			})),
			...samples.map<Command>(sample => ({
				id: `sample-${sample.id}`,
				textValue: `${sample.name} sample ${sample.file}`,
				label: sample.name,
				group: "Sample",
				current: studio.sample() === sample.id,
				preview: () => studio.setSample(sample.id),
				run: () => studio.setSample(sample.id),
			})),
			...(["frame", "card"] as View[]).map<Command>(view => ({
				id: `view-${view}`,
				textValue: view === "frame" ? "Frame view" : "Theme card view",
				label: view === "frame" ? "Frame" : "Theme card",
				group: "View",
				current: studio.view() === view,
				preview: () => studio.setView(view),
				run: () => studio.setView(view),
			})),
			...colors.map<Command>(key => ({
				id: `edit-${key}`,
				textValue: `Edit ${slotLabel(key)} colour ${key}`,
				label: `Edit ${slotLabel(key).toLowerCase()}…`,
				group: "Colours",
				description: printColor(slotColor(now, key)),
				leading: swatch(slotColor(now, key)),
				run: () => edit(key),
			})),
			...(["dark", "light"] as Interface[]).map<Command>(value => ({
				id: `interface-${value}`,
				textValue: `${value} interface`,
				label: value === "dark" ? "Dark interface" : "Light interface",
				group: "Interface",
				current: theme() === value,
				preview: () => setTheme(value),
				run: () => setTheme(value),
			})),
		];
	};

	let before = { interface: theme(), sample: studio.sample(), view: studio.view() };
	const restore = () => {
		studio.setPreview(null);
		studio.setSample(before.sample);
		studio.setView(before.view);
		setTheme(before.interface);
	};
	const openCommands = () => {
		before = { interface: theme(), sample: studio.sample(), view: studio.view() };
		setCommandsOpen(true);
	};
	onModK(openCommands);

	onSettled(() => {
		const listener = (event: KeyboardEvent) => {
			if (!(event.metaKey || event.ctrlKey) || event.altKey || event.key.toLowerCase() !== "z") return;
			// Inside a field, undo belongs to the text being typed.
			if (event.target instanceof HTMLInputElement || event.target instanceof HTMLTextAreaElement) return;
			(event.shiftKey ? studio.redo : studio.undo)();
			event.preventDefault();
		};
		window.addEventListener("keydown", listener);
		return () => window.removeEventListener("keydown", listener);
	});

	return (
		<StudioContext value={studio}>
			<div class="ex-page">
				<header class="ex-header">
					<span class="ex-brand">
						<span class="ex-brand-mark">
							<Palette size={16} />
						</span>
						<span class="ex-hide-phone">Theme Studio</span>
					</span>
					<Name />
					<span class="ex-header-spacer" />
					<Show
						when={!isPhone()}
						fallback={
							<IconButton variant="secondary" ghost size={size()} aria-label="Open the colours" onClick={() => studio.setPanelOpen(true)}>
								<SlidersHorizontal size={16} />
							</IconButton>
						}
					>
						<Button variant="secondary" size={size()} leftIcon={<Search size={16} />} onClick={openCommands}>
							Search
							<Kbd>{shortcut.commands}</Kbd>
						</Button>
					</Show>
					<ExportControl />
					{/* A phone header has no room for the search button, so the command menu opens from here. */}
					<ExampleMenu slug="theme-studio">
						{isPhone() ? (
							<DropdownMenuItem onSelect={openCommands}>
								<span class="ex-menu-icon">
									<Search size={16} />
								</span>
								Search commands
							</DropdownMenuItem>
						) : undefined}
					</ExampleMenu>
				</header>
				<div class="ts-body">
					<main class="ex-island ts-stage">
						<Stage />
						<Toolbar hidden={commandsOpen()} />
					</main>
					<Show when={!isPhone()}>
						<aside class="ex-island ex-scroll ts-side" aria-label="Theme">
							<Panel />
						</aside>
					</Show>
				</div>
			</div>
			<Show when={isPhone()}>
				{/* No scrim and no title bar: the preview stays lit and in view above the sheet, so every change shows as it is made. */}
				<Sheet
					open={studio.panelOpen()}
					onOpenChange={open => {
						// Dragging the sheet away keeps the colour being picked, like closing a popover.
						if (!open && studio.picker()) studio.closePicker(true);
						studio.setPanelOpen(open);
					}}
					modal={false}
					aria-label="Theme"
					showCloseButton={false}
					draggable
					contentProps={{
						// Escape closes one layer (DESIGN.md §9.5): with a picker open it restores the colour and leaves the sheet.
						onEscapeKeyDown: event => {
							if (!studio.picker()) return;
							event.preventDefault();
							studio.closePicker(false);
						},
					}}
				>
					<PanelTabs />
				</Sheet>
			</Show>
			<ExportDialog />
			<ImportDialog />
			<CommandMenu
				open={commandsOpen()}
				onOpenChange={setCommandsOpen}
				items={commands()}
				title="Search commands"
				placeholder="Search colours, themes and actions"
				hint="↑↓ preview · ↵ apply · esc cancel"
				emptyContent="No command matches"
				onHighlightChange={item => {
					restore();
					item?.preview?.();
				}}
				onCancel={restore}
				onCloseAutoFocus={openEditing}
				onSelect={item => {
					// The preview ends first, so the choice enters the history as one step from the saved theme.
					restore();
					item.run();
				}}
			/>
			<Toaster toaster={notifications} closeLabel="Dismiss" />
		</StudioContext>
	);
}
