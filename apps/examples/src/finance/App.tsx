import { Button, type CommandItem, CommandMenu, createSelectOptions, createToaster, IconButton, Kbd, SegmentedControl, SegmentedControlItem, Select, Sheet, Text, Toaster } from "@codeui/kit";
import PanelRight from "lucide-solid/icons/panel-right";
import Plus from "lucide-solid/icons/plus";
import Search from "lucide-solid/icons/search";
import Wallet from "lucide-solid/icons/wallet";
import { createSignal, Show } from "solid-js";
import { ExampleMenu } from "../shared/ExampleMenu";
import { modKey, onModK } from "../shared/hotkey";
import { createIsPhone } from "../shared/media";
import { createControlSize } from "../shared/size";
import { setTheme, theme, type Theme } from "../shared/theme";
import { AddTransaction } from "./AddTransaction";
import { type Account, accounts, type PeriodId, periods } from "./data";
import { createLedger, LedgerContext } from "./ledger";
import { Categories, SpendingChart, Stats } from "./Overview";
import { Planning } from "./Planning";
import { Transactions } from "./Transactions";

/** A command that changes a value previews it while highlighted. `run` commits, Escape restores. */
type Command = CommandItem & { preview?: () => void; run: () => void };

export function App() {
	const notifications = createToaster();
	const ledger = createLedger(notifications);
	const isPhone = createIsPhone();
	const size = createControlSize();
	const [commandsOpen, setCommandsOpen] = createSignal(false);
	const [planningOpen, setPlanningOpen] = createSignal(false);
	const accountOptions = createSelectOptions(accounts, { key: "name", valueKey: "id" });

	// Read from the same data as the controls, so the menu lists every option they offer.
	const commands = (): Command[] => [
		{ id: "add", textValue: "Add transaction", label: "Add transaction", group: "Actions", run: () => ledger.setAdding(true) },
		...accounts.map<Command>(account => ({
			id: `account-${account.id}`,
			textValue: account.name,
			label: account.name,
			group: "Account",
			current: ledger.account() === account.id,
			preview: () => ledger.setAccount(account.id),
			run: () => ledger.setAccount(account.id),
		})),
		...periods.map<Command>(period => ({
			id: `period-${period.id}`,
			textValue: `Last ${period.label}`,
			label: `Last ${period.label}`,
			group: "Period",
			current: ledger.period() === period.id,
			preview: () => ledger.setPeriod(period.id),
			run: () => ledger.setPeriod(period.id),
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
	];

	let saved: { account: Account["id"]; period: PeriodId; theme: Theme } | undefined;
	const restore = () => {
		if (!saved) return;
		ledger.setAccount(saved.account);
		ledger.setPeriod(saved.period);
		setTheme(saved.theme);
	};
	const openCommands = () => {
		saved = { account: ledger.account(), period: ledger.period(), theme: theme() };
		setCommandsOpen(true);
	};
	onModK(openCommands);

	const accountSelect = () => (
		<div class="fin-account">
			<Select
				aria-label="Account"
				size={size()}
				options={accountOptions.options()}
				{...accountOptions.props()}
				{...accountOptions.controlled(ledger.account, value => value && ledger.setAccount(value))}
			/>
		</div>
	);

	return (
		<LedgerContext.Provider value={ledger}>
			<div class="ex-page">
				<header class="ex-header">
					<span class="ex-brand">
						<span class="ex-brand-mark">
							<Wallet size={16} />
						</span>
						Ledger
					</span>
					<Show when={!isPhone()}>{accountSelect()}</Show>
					<span class="ex-header-spacer" />
					<Show
						when={!isPhone()}
						fallback={
							<>
								<IconButton theme="secondary" variant="ghost" size={size()} aria-label="Search commands" onClick={openCommands}>
									<Search size={16} />
								</IconButton>
								<IconButton theme="secondary" variant="ghost" size={size()} aria-label="Open planning" onClick={() => setPlanningOpen(true)}>
									<PanelRight size={16} />
								</IconButton>
								<IconButton theme="primary" size={size()} aria-label="Add transaction" onClick={() => ledger.setAdding(true)}>
									<Plus size={16} />
								</IconButton>
							</>
						}
					>
						<Button theme="secondary" size={size()} leftIcon={<Search size={16} />} onClick={openCommands}>
							Search
							<Kbd>{modKey()}K</Kbd>
						</Button>
						<Button theme="primary" size={size()} leftIcon={<Plus size={16} />} onClick={() => ledger.setAdding(true)}>
							Add transaction
						</Button>
					</Show>
					<ExampleMenu slug="finance" />
				</header>
				<div class="fin-body">
					<main class="ex-island ex-scroll fin-main">
						<div class="fin-toolbar">
							<Text as="h1" size="md" weight="semibold">
								Overview
							</Text>
							<Show when={isPhone()}>{accountSelect()}</Show>
							<SegmentedControl aria-label="Period" size={size()} value={ledger.period()} onChange={value => ledger.setPeriod(value as PeriodId)}>
								{periods.map(period => (
									<SegmentedControlItem value={period.id}>{period.label}</SegmentedControlItem>
								))}
							</SegmentedControl>
						</div>
						<Stats />
						<div class="fin-charts">
							<SpendingChart />
							<Categories />
						</div>
						<Transactions />
					</main>
					<Show when={!isPhone()}>
						<aside class="ex-island ex-scroll fin-side" aria-label="Planning">
							<Planning />
						</aside>
					</Show>
				</div>
			</div>
			<Show when={isPhone()}>
				<Sheet open={planningOpen()} onOpenChange={setPlanningOpen} title="Planning" closeLabel="Close planning" draggable>
					<Planning />
				</Sheet>
			</Show>
			<AddTransaction />
			<CommandMenu
				open={commandsOpen()}
				onOpenChange={setCommandsOpen}
				items={commands()}
				title="Search commands"
				placeholder="Search accounts, periods and actions"
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
		</LedgerContext.Provider>
	);
}
