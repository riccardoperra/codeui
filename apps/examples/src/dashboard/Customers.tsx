import {
	Badge,
	Button,
	Checkbox,
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
	Pagination,
	Skeleton,
	Tabs,
	TabsContent,
	TabsHeader,
	TabsList,
	Text,
	TextField,
	Tooltip,
} from "@codeui/kit";
import Ellipsis from "lucide-solid/icons/ellipsis";
import { createEffect, createMemo, createSignal, For, on, onCleanup, onMount, Show } from "solid-js";
import { formatMoneyWhole, formatNumber } from "../shared/format";
import { createIsPhone } from "../shared/media";
import { createControlSize } from "../shared/size";
import { type Customer, formatLastSeen, mrrOf, planOf, plans, type Status, statusLabels, statusOf } from "./data";
import { usePulse } from "./pulse";

const pageSize = 10;

type TabId = "all" | "active" | "trial" | "churned";
const tabs: { id: TabId; label: string; statuses: Status[] }[] = [
	{ id: "all", label: "All", statuses: ["active", "past-due", "trial", "churned"] },
	// A failed payment is still a subscription, so it stays with the active accounts.
	{ id: "active", label: "Active", statuses: ["active", "past-due"] },
	{ id: "trial", label: "Trial", statuses: ["trial"] },
	{ id: "churned", label: "Churned", statuses: ["churned"] },
];

const money = (customer: Customer) => (mrrOf(customer) ? formatMoneyWhole(mrrOf(customer)) : "—");

export function Customers() {
	const pulse = usePulse();
	const size = createControlSize();
	const isPhone = createIsPhone();
	const [tab, setTab] = createSignal<TabId>("all");
	const [query, setQuery] = createSignal("");
	const [page, setPage] = createSignal(1);
	const [selected, setSelected] = createSignal<string[]>([]);

	onMount(() => {
		if (pulse.customersLoaded()) return;
		const timer = setTimeout(() => pulse.setCustomersLoaded(true), 700);
		onCleanup(() => clearTimeout(timer));
	});

	const sorted = createMemo(() => [...pulse.customers()].sort((a, b) => a.lastSeen - b.lastSeen));
	const count = (id: TabId) => sorted().filter(c => tabs.find(t => t.id === id)!.statuses.includes(statusOf(c))).length;
	const filtered = createMemo(() => {
		const text = query().trim().toLowerCase();
		const { statuses } = tabs.find(t => t.id === tab())!;
		return sorted().filter(c => statuses.includes(statusOf(c)) && (!text || `${c.company} ${c.owner}`.toLowerCase().includes(text)));
	});
	const pages = () => Math.max(1, Math.ceil(filtered().length / pageSize));
	const rows = () => filtered().slice((page() - 1) * pageSize, page() * pageSize);
	// A new filter starts from the first page with nothing selected. An archive only steps back when its page empties.
	createEffect(on([tab, query], () => (setPage(1), setSelected([])), { defer: true }));
	createEffect(() => page() > pages() && setPage(pages()));

	const onPage = () => rows().filter(c => selected().includes(c.id));
	const selectPage = (checked: boolean) => {
		const ids = rows().map(c => c.id);
		setSelected(list => (checked ? [...new Set([...list, ...ids])] : list.filter(id => !ids.includes(id))));
	};
	const archiveSelected = () => {
		pulse.archive(selected());
		setSelected([]);
	};

	const head = () => (
		<thead>
			<tr>
				<th scope="col" class="dash-check">
					<label class="dash-check-target">
						<Checkbox
							size="sm"
							label={<span class="ex-sr-only">Select every customer on this page</span>}
							checked={onPage().length === rows().length && rows().length > 0}
							indeterminate={onPage().length > 0 && onPage().length < rows().length}
							onChange={selectPage}
						/>
					</label>
				</th>
				<th scope="col">Company</th>
				<th scope="col" class="ex-hide-phone">
					Plan
				</th>
				<th scope="col" class="dash-number ex-hide-phone">
					MRR
				</th>
				<th scope="col" class="dash-number dash-wide">
					Seats
				</th>
				<th scope="col" class="dash-wide">
					Last seen
				</th>
				<th scope="col">Status</th>
				<th scope="col" class="dash-actions">
					<span class="ex-sr-only">Actions</span>
				</th>
			</tr>
		</thead>
	);

	const empty = () => (
		<div class="dash-empty">
			<Text as="p" size="sm" weight="medium">
				{query().trim() ? "No customers match" : `No ${tabs.find(t => t.id === tab())!.label.toLowerCase()} customers`}
			</Text>
			<Text as="p" size="xs" tone="muted">
				{query().trim() ? `Nothing in this list matches “${query().trim()}”.` : "Every customer is in another list."}
			</Text>
			<Button theme="secondary" size={size()} onClick={() => (query().trim() ? setQuery("") : setTab("all"))}>
				{query().trim() ? "Clear search" : "Show all customers"}
			</Button>
		</div>
	);

	const panel = () => (
		<Show
			when={pulse.customersLoaded()}
			fallback={
				<div class="dash-table-wrap" aria-busy="true" aria-label="Loading customers">
					<table class="dash-table">
						{head()}
						<tbody>
							<For each={Array.from({ length: pageSize })}>{() => <SkeletonRow />}</For>
						</tbody>
					</table>
				</div>
			}
		>
			<Show when={rows().length} fallback={empty()}>
				<div class="dash-table-wrap">
					{/* The bulk actions lie over the column titles, so selecting a row moves nothing. */}
					<Show when={selected().length}>
						<div class="dash-bulk" role="group" aria-label="Selected customers">
							<Text size="sm" weight="medium" class="ex-tabular">
								{selected().length} selected
							</Text>
							<Button theme="secondary" size="xs" onClick={archiveSelected}>
								Archive
							</Button>
							<Button theme="secondary" variant="ghost" size="xs" onClick={() => setSelected([])}>
								Clear
							</Button>
						</div>
					</Show>
					<table class="dash-table">
						{head()}
						<tbody>
							<For each={rows()}>
								{customer => (
									<Row
										customer={customer}
										selected={selected().includes(customer.id)}
										onSelect={checked => setSelected(list => (checked ? [...list, customer.id] : list.filter(id => id !== customer.id)))}
									/>
								)}
							</For>
						</tbody>
					</table>
				</div>
				<footer class="dash-table-footer">
					<Text size="xs" tone="muted" class="ex-tabular" aria-live="polite">
						{(page() - 1) * pageSize + 1}–{Math.min(page() * pageSize, filtered().length)} of {filtered().length}
					</Text>
					<Show when={pages() > 1}>
						<Pagination pages={pages()} page={page()} onChange={setPage} size={size()} maxPages={isPhone() ? 3 : 5} />
					</Show>
				</footer>
			</Show>
		</Show>
	);

	return (
		<>
			<div class="dash-toolbar">
				<Text as="h1" size="md" weight="semibold">
					Customers
				</Text>
				<div class="dash-search">
					<TextField aria-label="Search customers" placeholder="Search company or owner" size={size()} value={query()} onChange={setQuery} />
				</div>
			</div>
			<Tabs theme="inline" value={tab()} onChange={value => setTab(value as TabId)} class="dash-tabs">
				<TabsList aria-label="Customer status" class="dash-tabs-list">
					<For each={tabs}>
						{item => (
							<TabsHeader value={item.id}>
								{item.label} <span class="dash-tab-count ex-tabular">{count(item.id)}</span>
							</TabsHeader>
						)}
					</For>
				</TabsList>
				<For each={tabs}>
					{item => (
						<TabsContent value={item.id} class="dash-tabs-panel">
							{panel()}
						</TabsContent>
					)}
				</For>
			</Tabs>
		</>
	);
}

function Row(props: { customer: Customer; selected: boolean; onSelect: (checked: boolean) => void }) {
	const pulse = usePulse();
	const c = () => props.customer;
	const status = () => statusOf(c());
	return (
		<tr data-customer={c().id} data-selected={props.selected ? "" : undefined}>
			<td class="dash-check">
				{/* The box is 20px. The label around it makes the whole cell the target. */}
				<label class="dash-check-target">
					<Checkbox size="sm" label={<span class="ex-sr-only">Select {c().company}</span>} checked={props.selected} onChange={props.onSelect} />
				</label>
			</td>
			<td>
				<button type="button" class="dash-company" aria-label={`Open ${c().company}`} onClick={() => pulse.showCustomer(c().id, `[data-customer="${c().id}"] .dash-company`)}>
					<span class="dash-avatar" aria-hidden="true">
						{c().company[0]}
					</span>
					<span class="dash-company-text">
						<Text as="span" size="sm" weight="medium" class="ex-truncate" title={c().company}>
							{c().company}
						</Text>
						<Text as="span" size="xs" tone="muted" class="ex-only-phone ex-tabular">
							{planOf(c().plan).name} · {money(c())}
						</Text>
					</span>
				</button>
			</td>
			<td class="ex-hide-phone">
				<Text size="caption" tone="muted">
					{planOf(c().plan).name}
				</Text>
			</td>
			<td class="dash-number ex-hide-phone">
				<Text size="sm" weight="medium" class="ex-tabular">
					{money(c())}
				</Text>
			</td>
			<td class="dash-number dash-wide">
				<Text size="caption" tone="muted" class="ex-tabular">
					{formatNumber(c().seats)}
				</Text>
			</td>
			<td class="dash-wide">
				<Text size="caption" tone="muted" class="ex-tabular">
					{formatLastSeen(c().lastSeen)}
				</Text>
			</td>
			<td>
				{/* Only a failed payment asks for attention. The other states are neutral. */}
				<Badge tone={status() === "past-due" ? "danger" : "neutral"}>{statusLabels[status()]}</Badge>
			</td>
			<td class="dash-actions">
				<DropdownMenu placement="bottom-end">
					<Tooltip content="Actions" placement="left" theme="secondary">
						<DropdownMenuTrigger as={IconButton} size="xs" theme="secondary" variant="ghost" aria-label={`Actions for ${c().company}`}>
							<Ellipsis size={16} />
						</DropdownMenuTrigger>
					</Tooltip>
					<DropdownMenuPortal>
						<DropdownMenuContent>
							<DropdownMenuItem onSelect={() => pulse.showCustomer(c().id, `[data-customer="${c().id}"] .dash-actions button`)}>View details</DropdownMenuItem>
							<Show when={status() === "past-due"}>
								<DropdownMenuItem onSelect={() => pulse.retryPayment(c().id)}>Retry payment</DropdownMenuItem>
							</Show>
							<Show when={status() !== "churned"}>
								<DropdownSubMenu>
									<DropdownSubMenuTrigger>Change plan</DropdownSubMenuTrigger>
									<DropdownMenuPortal>
										<DropdownSubMenuContent>
											<For each={plans.filter(plan => plan.id !== c().plan)}>
												{plan => <DropdownMenuItem onSelect={() => pulse.setPlan(c().id, plan.id)}>{plan.name}</DropdownMenuItem>}
											</For>
										</DropdownSubMenuContent>
									</DropdownMenuPortal>
								</DropdownSubMenu>
							</Show>
							<DropdownMenuSeparator />
							<DropdownMenuItem onSelect={() => pulse.archive([c().id])}>Archive</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenuPortal>
				</DropdownMenu>
			</td>
		</tr>
	);
}

/** The shape of a row, so the table does not move when the customers arrive. */
function SkeletonRow() {
	return (
		<tr>
			<td class="dash-check">
				<Skeleton width="20px" height="20px" radius="var(--cui-radius-badge)" />
			</td>
			<td>
				<div class="dash-company">
					<Skeleton circle height="28px" />
					<Skeleton width="132px" height="14px" />
				</div>
			</td>
			<td class="ex-hide-phone">
				<Skeleton width="56px" height="12px" />
			</td>
			<td class="dash-number ex-hide-phone">
				<Skeleton width="48px" height="14px" />
			</td>
			<td class="dash-number dash-wide">
				<Skeleton width="24px" height="12px" />
			</td>
			<td class="dash-wide">
				<Skeleton width="48px" height="12px" />
			</td>
			<td>
				<Skeleton width="52px" height="20px" />
			</td>
			<td class="dash-actions" />
		</tr>
	);
}
