import {
	Badge,
	Button,
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
	Select,
	Text,
	TextField,
} from "@codeui/kit";
import Ellipsis from "@lucide/solid/icons/ellipsis";
import { createEffect, createMemo, createSignal, For, Show } from "solid-js";
import { formatDay, formatMoney } from "../shared/format";
import { createControlSize } from "../shared/size";
import { accounts, categories, type Category, type Transaction } from "./data";
import { useLedger } from "./ledger";

const pageSize = 8;
const allCategories = "All categories";
const filterOptions = [allCategories, ...categories, "Income"];
const accountName = (id: string) => accounts.find(a => a.id === id)!.name;
/** `+$3,840.00` for money in, `−$54.20` for money out. The sign carries the direction. */
const signed = (amount: number) => `${amount > 0 ? "+" : "−"}${formatMoney(Math.abs(amount))}`;

export function Transactions() {
	const ledger = useLedger();
	const size = createControlSize();
	const [query, setQuery] = createSignal("");
	const [category, setCategory] = createSignal(allCategories);
	const [page, setPage] = createSignal(1);

	const filtered = createMemo(() => {
		const text = query().trim().toLowerCase();
		return ledger
			.current()
			.filter(t => category() === allCategories || t.category === category())
			.filter(t => !text || t.merchant.toLowerCase().includes(text));
	});
	const pages = () => Math.max(1, Math.ceil(filtered().length / pageSize));
	const rows = () => filtered().slice((page() - 1) * pageSize, page() * pageSize);
	// A new filter or scope starts from the first page. A deletion only steps back when its page empties.
	createEffect(() => [query(), category(), ledger.account(), ledger.period()], () => { setPage(1); }, { defer: true });
	createEffect(() => ({ page: page(), pages: pages() }), state => { if (state.page > state.pages) setPage(state.pages); });

	const clear = () => {
		setQuery("");
		setCategory(allCategories);
	};

	return (
		<section class="fin-card" aria-labelledby="transactions-title">
			<header class="fin-card-header">
				<div>
					<Text as="h2" id="transactions-title" size="sm" weight="semibold">
						Transactions
					</Text>
					<Text as="p" size="xs" tone="muted" class="ex-tabular" aria-live="polite">
						{filtered().length} in this period
					</Text>
				</div>
				<div class="fin-filters">
					<TextField aria-label="Search merchants" placeholder="Search merchants" size={size()} value={query()} onChange={setQuery} />
					<Select aria-label="Category" size={size()} options={filterOptions} value={category()} onChange={value => value && setCategory(value)} />
				</div>
			</header>
			<Show
				when={rows().length}
				fallback={
					<div class="fin-empty">
						<Text as="p" size="sm" weight="medium">
							No transactions match
						</Text>
						<Text as="p" size="xs" tone="muted">
							Nothing in this period fits the search and the category.
						</Text>
						<Button variant="secondary" size={size()} onClick={clear}>
							Clear filters
						</Button>
					</div>
				}
			>
				<table class="fin-table">
					<thead>
						<tr>
							<th scope="col">Merchant</th>
							<th scope="col" class="ex-hide-phone">
								Category
							</th>
							<th scope="col" class="fin-wide">
								Account
							</th>
							<th scope="col" class="ex-hide-phone">
								Date
							</th>
							<th scope="col" class="fin-amount">
								Amount
							</th>
							<th scope="col">
								<span class="ex-sr-only">Actions</span>
							</th>
						</tr>
					</thead>
					<tbody>
						<For each={rows()}>{transaction => <Row transaction={transaction} />}</For>
					</tbody>
				</table>
				<Show when={pages() > 1}>
					<footer class="fin-pagination">
						<Pagination pages={pages()} page={page()} onChange={setPage} size={size()} maxPages={5} />
					</footer>
				</Show>
			</Show>
		</section>
	);
}

function Row(props: { transaction: Transaction }) {
	const ledger = useLedger();
	const t = () => props.transaction;
	return (
		<tr>
			<td>
				<div class="fin-merchant">
					<span class="fin-avatar" aria-hidden="true">
						{t().merchant[0]}
					</span>
					<div class="fin-merchant-text">
						<Text as="div" size="sm" weight="medium" class="ex-truncate" title={t().merchant}>
							{t().merchant}
						</Text>
						<Text as="div" size="xs" tone="muted" class="ex-only-phone">
							{t().category} · {formatDay(t().date)}
						</Text>
					</div>
					<Show when={t().pending}>
						<Badge>Pending</Badge>
					</Show>
				</div>
			</td>
			<td class="ex-hide-phone">
				<Text size="caption" tone="muted">
					{t().category}
				</Text>
			</td>
			<td class="fin-wide">
				<Text size="caption" tone="muted">
					{accountName(t().account)}
				</Text>
			</td>
			<td class="ex-hide-phone">
				<Text size="caption" tone="muted" class="ex-tabular">
					{formatDay(t().date)}
				</Text>
			</td>
			<td class="fin-amount">
				<Text size="sm" weight="medium" class="ex-tabular">
					{signed(t().amount)}
				</Text>
			</td>
			<td class="fin-actions">
				<DropdownMenu placement="bottom-end">
					<DropdownMenuTrigger as={IconButton} size="xs" variant="secondary" ghost aria-label={`Actions for ${t().merchant}`}>
						<Ellipsis size={16} />
					</DropdownMenuTrigger>
					<DropdownMenuPortal>
						<DropdownMenuContent>
							<Show when={t().amount < 0}>
								<DropdownSubMenu>
									<DropdownSubMenuTrigger>Move to category</DropdownSubMenuTrigger>
									<DropdownMenuPortal>
										<DropdownSubMenuContent>
											<For each={categories.filter(c => c !== t().category)}>
												{category => (
													<DropdownMenuItem onSelect={() => ledger.setCategory(t().id, category as Category)}>{category}</DropdownMenuItem>
												)}
											</For>
										</DropdownSubMenuContent>
									</DropdownMenuPortal>
								</DropdownSubMenu>
								<DropdownMenuSeparator />
							</Show>
							<DropdownMenuItem onSelect={() => ledger.remove(t().id)}>Delete</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenuPortal>
				</DropdownMenu>
			</td>
		</tr>
	);
}
