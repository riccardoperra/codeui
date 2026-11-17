import { Text } from "@codeui/kit";
import { For } from "solid-js";
import { BarList, ChartLegend, LineChart, type Series } from "../shared/charts";
import { formatChange, formatMoney, formatMoneyWhole, formatPercent } from "../shared/format";
import { periods } from "./data";
import { useLedger } from "./ledger";

const change = (now: number, before: number) => (before ? (now - before) / Math.abs(before) : 0);

export function Stats() {
	const ledger = useLedger();
	const label = () => periods.find(p => p.id === ledger.period())!.label;
	const tiles = () => [
		{ name: "Balance", value: formatMoney(ledger.balance()), change: change(ledger.balance(), ledger.balanceBefore()) },
		{ name: "Income", value: formatMoney(ledger.summary().income), change: change(ledger.summary().income, ledger.previousSummary().income) },
		{ name: "Spending", value: formatMoney(ledger.summary().spending), change: change(ledger.summary().spending, ledger.previousSummary().spending) },
		{
			name: "Savings rate",
			value: formatPercent(ledger.summary().savingsRate),
			change: ledger.summary().savingsRate - ledger.previousSummary().savingsRate,
		},
	];
	return (
		<dl class="fin-stats">
			<For each={tiles()}>
				{tile => (
					<div class="fin-stat">
						<Text as="dt" size="xs" tone="muted">
							{tile.name}
						</Text>
						{/* The widest value is reserved, so a new period never moves the tiles. */}
						<Text as="dd" size="xl" weight="semibold" class="fin-stat-value ex-tabular">
							{tile.value}
						</Text>
						<Text as="dd" size="xs" tone="muted" class="ex-tabular">
							{formatChange(tile.change)} vs the {label()} before
						</Text>
					</div>
				)}
			</For>
		</dl>
	);
}

export function SpendingChart() {
	const ledger = useLedger();
	const label = () => periods.find(p => p.id === ledger.period())!.label;
	const series = (): Series[] => [
		{ name: `Last ${label()}`, values: ledger.series().current, tone: "primary" },
		{ name: `The ${label()} before`, values: ledger.series().previous, tone: "comparison" },
	];
	return (
		<section class="fin-card" aria-labelledby="spending-title">
			<header class="fin-card-header">
				<div>
					<Text as="h2" id="spending-title" size="sm" weight="semibold">
						Spending
					</Text>
					<Text as="p" size="xs" tone="muted">
						Running total, against the period before.
					</Text>
				</div>
				<ChartLegend series={series()} />
			</header>
			<LineChart aria-label="Cumulative spending" labels={ledger.series().labels} series={series()} format={formatMoneyWhole} />
		</section>
	);
}

export function Categories() {
	const ledger = useLedger();
	return (
		<section class="fin-card" aria-labelledby="categories-title">
			<header class="fin-card-header">
				<div>
					<Text as="h2" id="categories-title" size="sm" weight="semibold">
						Where it went
					</Text>
					<Text as="p" size="xs" tone="muted">
						Spending by category.
					</Text>
				</div>
			</header>
			<BarList items={ledger.byCategory().slice(0, 6)} format={formatMoneyWhole} />
		</section>
	);
}
