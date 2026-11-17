import { Button, type CommandItem, CommandMenu, createToaster, DropdownMenuItem, IconButton, Kbd, Sheet, Text, Toaster, Tooltip } from "@codeui/kit";
import Activity from "lucide-solid/icons/activity";
import ChartNoAxesColumn from "lucide-solid/icons/chart-no-axes-column";
import Menu from "lucide-solid/icons/menu";
import Search from "lucide-solid/icons/search";
import SettingsIcon from "lucide-solid/icons/settings";
import UserPlus from "lucide-solid/icons/user-plus";
import Users from "lucide-solid/icons/users";
import { createSignal, For, type JSX, Match, Show, Switch } from "solid-js";
import { ExampleMenu, MadeWith } from "../shared/ExampleMenu";
import { modKey, onModK } from "../shared/hotkey";
import { createIsPhone } from "../shared/media";
import { createControlSize } from "../shared/size";
import { setTheme, theme, type Theme } from "../shared/theme";
import { Customers } from "./Customers";
import { CustomerSheet } from "./CustomerSheet";
import { type RangeId, ranges } from "./data";
import { Overview } from "./Overview";
import { createPulse, PulseContext, usePulse, type ViewId } from "./pulse";
import { sections, Settings } from "./Settings";

const views: { id: ViewId; name: string; icon: () => JSX.Element }[] = [
	{ id: "overview", name: "Overview", icon: () => <ChartNoAxesColumn size={16} /> },
	{ id: "customers", name: "Customers", icon: () => <Users size={16} /> },
];

/** A command that changes a value previews it while highlighted. `run` commits, Escape restores. */
type Command = CommandItem & { preview?: () => void; run: () => void };

/** The left island on a desktop, and the body of a left sheet on a phone. */
function Navigation(props: { onNavigate?: () => void }) {
	const pulse = usePulse();
	const name = () => pulse.workspace().trim() || "Untitled workspace";
	return (
		<div class="dash-nav">
			<div class="dash-workspace">
				<span class="dash-avatar" aria-hidden="true">
					{name()[0].toUpperCase()}
				</span>
				<div class="dash-workspace-text">
					<Text as="div" size="sm" weight="semibold" class="ex-truncate" title={name()}>
						{name()}
					</Text>
					<Text as="div" size="xs" tone="muted" class="ex-tabular">
						{pulse.members().length} members
					</Text>
				</div>
			</div>
			<nav aria-label="Main">
				<ul class="dash-nav-list">
					<For each={views}>
						{view => (
							<li>
								<button
									type="button"
									class="dash-nav-item"
									aria-current={pulse.view() === view.id ? "page" : undefined}
									onClick={() => (pulse.setView(view.id), props.onNavigate?.())}
								>
									<span class="dash-nav-icon">{view.icon()}</span>
									{view.name}
								</button>
							</li>
						)}
					</For>
				</ul>
			</nav>
			<div class="dash-nav-end">
				<button type="button" class="dash-nav-item" onClick={() => (props.onNavigate?.(), pulse.setSection("general"))}>
					<span class="dash-nav-icon">
						<SettingsIcon size={16} />
					</span>
					Settings
				</button>
				<div class="dash-nav-credit">
					<MadeWith />
				</div>
			</div>
		</div>
	);
}

export function App() {
	const notifications = createToaster();
	const pulse = createPulse(notifications);
	const isPhone = createIsPhone();
	const size = createControlSize();
	const [commandsOpen, setCommandsOpen] = createSignal(false);
	const [navOpen, setNavOpen] = createSignal(false);
	const invite = () => pulse.setSection("members");

	// Read from the same data as the controls, so the menu lists every option they offer.
	const commands = (): Command[] => [
		// An action comes first: the menu opens on a row that previews nothing.
		{ id: "invite", textValue: "Invite people", label: "Invite people", leading: <UserPlus size={16} />, group: "Actions", run: invite },
		...views.map<Command>(view => ({
			id: `view-${view.id}`,
			textValue: view.name,
			label: view.name,
			leading: view.icon(),
			group: "Go to",
			current: pulse.view() === view.id,
			preview: () => pulse.setView(view.id),
			run: () => pulse.setView(view.id),
		})),
		...ranges.map<Command>(range => ({
			id: `range-${range.id}`,
			textValue: `Last ${range.label}`,
			label: `Last ${range.label}`,
			group: "Range",
			current: pulse.range() === range.id,
			preview: () => (pulse.setView("overview"), pulse.setRange(range.id)),
			run: () => (pulse.setView("overview"), pulse.setRange(range.id)),
		})),
		...(["dark", "light"] as Theme[]).map<Command>(value => ({
			id: `theme-${value}`,
			textValue: `${value} theme`,
			label: value === "dark" ? "Dark theme" : "Light theme",
			group: "Theme",
			current: theme() === value,
			preview: () => setTheme(value),
			run: () => setTheme(value),
		})),
		...sections.map<Command>(section => ({
			id: `settings-${section.id}`,
			textValue: `${section.name} settings ${section.terms}`,
			label: section.name,
			leading: section.icon(),
			group: "Settings",
			run: () => pulse.setSection(section.id),
		})),
	];

	let saved: { view: ViewId; range: RangeId; theme: Theme } | undefined;
	const restore = () => {
		if (!saved) return;
		pulse.setView(saved.view);
		pulse.setRange(saved.range);
		setTheme(saved.theme);
	};
	const openCommands = () => {
		saved = { view: pulse.view(), range: pulse.range(), theme: theme() };
		setCommandsOpen(true);
	};
	onModK(openCommands);

	return (
		<PulseContext.Provider value={pulse}>
			<div class="ex-page">
				<header class="ex-header">
					<Show when={isPhone()}>
						<IconButton theme="secondary" variant="ghost" size={size()} aria-label="Open navigation" onClick={() => setNavOpen(true)}>
							<Menu size={20} />
						</IconButton>
					</Show>
					<span class="ex-brand">
						<span class="ex-brand-mark">
							<Activity size={16} />
						</span>
						Pulse
					</span>
					<span class="ex-header-spacer" />
					<Show
						when={!isPhone()}
						fallback={
							<>
								<IconButton theme="secondary" variant="ghost" size={size()} aria-label="Search commands" onClick={openCommands}>
									<Search size={16} />
								</IconButton>
								<IconButton theme="primary" size={size()} aria-label="Invite people" onClick={invite}>
									<UserPlus size={16} />
								</IconButton>
							</>
						}
					>
						<Tooltip content="Search commands" placement="bottom" theme="secondary">
							<Button theme="secondary" size={size()} leftIcon={<Search size={16} />} onClick={openCommands}>
								Search
								<Kbd>{modKey()}K</Kbd>
							</Button>
						</Tooltip>
						<Button theme="primary" size={size()} leftIcon={<UserPlus size={16} />} onClick={invite}>
							Invite
						</Button>
					</Show>
					<ExampleMenu slug="dashboard">
						<DropdownMenuItem onSelect={() => pulse.setSection("general")}>
							<span class="ex-menu-icon">
								<SettingsIcon size={16} />
							</span>
							Settings
						</DropdownMenuItem>
					</ExampleMenu>
				</header>
				<div class="dash-body">
					<Show when={!isPhone()}>
						<aside class="ex-island dash-side">
							<Navigation />
						</aside>
					</Show>
					<main class="ex-island ex-scroll dash-main">
						<Switch>
							<Match when={pulse.view() === "overview"}>
								<Overview />
							</Match>
							<Match when={pulse.view() === "customers"}>
								<Customers />
							</Match>
						</Switch>
					</main>
				</div>
			</div>
			<Show when={isPhone()}>
				<Sheet side="left" open={navOpen()} onOpenChange={setNavOpen} title="Pulse" closeLabel="Close navigation" class="dash-nav-sheet">
					<Navigation onNavigate={() => setNavOpen(false)} />
				</Sheet>
			</Show>
			<CustomerSheet />
			<Settings />
			<CommandMenu
				open={commandsOpen()}
				onOpenChange={setCommandsOpen}
				items={commands()}
				title="Search commands"
				placeholder="Search views, ranges and settings"
				hint="↑↓ preview · ↵ apply · esc cancel"
				emptyContent="No command matches"
				onHighlightChange={item => (item?.preview ? item.preview() : restore())}
				onCancel={restore}
				onSelect={item => {
					// An action leaves the previewed values as they were when the menu opened.
					if (!item.preview) restore();
					item.run();
				}}
			/>
			<Toaster toaster={notifications} closeLabel="Dismiss" />
		</PulseContext.Provider>
	);
}
