import { SegmentedControl, SegmentedControlItem, Text } from "@codeui/kit";
import { For, type JSX } from "solid-js";
import { BarChart, BarList, ChartLegend, LineChart, type Series, Sparkline } from "../shared/charts";
import { formatChange, formatCompact, formatMoneyWhole, formatNumber, formatPercent } from "../shared/format";
import { createIsPhone } from "../shared/media";
import { createControlSize } from "../shared/size";
import { formatAge, type RangeId, rangeOf, ranges } from "./data";
import { usePulse } from "./pulse";

// Each chart is as tall as the list beside it, and the four cards fit a 900px window without scrolling.
const chartHeight = { activeUsers: 208, signups: 220 };

const ratio = (now: number, before: number) => (before ? (now - before) / before : 0);
/** `+0.4 pts`: a rate changes in points, not in percent of itself. */
const points = (change: number) => `${change > 0 ? "+" : change < 0 ? "−" : ""}${Math.abs(change * 100).toFixed(1)} pts`;
const running = (values: readonly number[]) => {
	let total = 0;
	return values.map(value => (total += value));
};

function Card(props: { id: string; title: string; description: string; aside?: JSX.Element; children: JSX.Element }) {
	return (
		<section class="dash-card" aria-labelledby={props.id}>
			<header class="dash-card-header">
				<div>
					<Text as="h2" id={props.id} size="sm" weight="semibold">
						{props.title}
					</Text>
					<Text as="p" size="xs" tone="muted">
						{props.description}
					</Text>
				</div>
				{props.aside}
			</header>
			{props.children}
		</section>
	);
}

function Stats() {
	const pulse = usePulse();
	const isPhone = createIsPhone();
	const tiles = () => {
		const now = pulse.summary();
		const before = pulse.summaryBefore();
		const series = pulse.series();
		return [
			{ name: "MRR", value: formatMoneyWhole(now.mrr), change: formatChange(ratio(now.mrr, now.mrrAtStart)), trend: series.mrr },
			{ name: "Active users", value: formatNumber(now.activeUsers), change: formatChange(ratio(now.activeUsers, before.activeUsers)), trend: series.active },
			{ name: "Trial conversions", value: formatNumber(now.conversions), change: formatChange(ratio(now.conversions, before.conversions)), trend: running(series.conversions) },
			{ name: "Churn", value: formatPercent(now.churnRate), change: points(now.churnRate - before.churnRate), trend: running(series.churns) },
		];
	};
	return (
		<dl class="dash-stats">
			<For each={tiles()}>
				{tile => (
					<div class="dash-stat">
						<Text as="dt" size="xs" tone="muted">
							{tile.name}
						</Text>
						<Text as="dd" size="xl" weight="semibold" class="dash-stat-value ex-tabular">
							{tile.value}
						</Text>
						<dd class="dash-stat-trend">
							{/* Narrower on a phone, where the widest value needs the room. */}
							<Sparkline values={tile.trend} width={isPhone() ? 40 : 72} />
						</dd>
						{/* The sign carries the direction: a rise in churn is not good news, so colour would mislead. */}
						<Text as="dd" size="xs" tone="muted" class="dash-stat-change ex-tabular">
							{tile.change} vs previous {rangeOf(pulse.range()).label}
						</Text>
					</div>
				)}
			</For>
		</dl>
	);
}

function ActiveUsers() {
	const pulse = usePulse();
	const label = () => rangeOf(pulse.range()).label;
	const series = (): Series[] => [
		{ name: `Last ${label()}`, values: pulse.series().active, tone: "primary" },
		...(pulse.compare() ? [{ name: `Previous ${label()}`, values: pulse.series().activeBefore, tone: "comparison" } as Series] : []),
	];
	return (
		<Card
			id="active-title"
			title="Active users"
			description={pulse.range() === "90d" ? "Daily average of each week." : "People who opened the product each day."}
			aside={<ChartLegend series={series()} />}
		>
			<LineChart aria-label="Active users" labels={pulse.series().labels} series={series()} format={formatCompact} height={chartHeight.activeUsers} />
		</Card>
	);
}

function Signups() {
	const pulse = usePulse();
	return (
		<Card id="signups-title" title="Signups" description={`${formatNumber(pulse.summary().signups)} trials started, per ${pulse.range() === "90d" ? "week" : "day"}.`}>
			<BarChart
				aria-label="Signups"
				labels={pulse.series().labels}
				series={[{ name: "Signups", values: pulse.series().signups, tone: "primary" }]}
				format={formatNumber}
				height={chartHeight.signups}
			/>
		</Card>
	);
}

function Sources() {
	const pulse = usePulse();
	return (
		<Card id="sources-title" title="Signups by source" description="Where the new trials came from.">
			<BarList items={pulse.sources().slice(0, 5)} format={formatNumber} />
		</Card>
	);
}

function Activity() {
	const pulse = usePulse();
	return (
		<Card id="activity-title" title="Recent activity" description="The latest changes to your customers.">
			<ul class="dash-activity">
				<For
					each={pulse.activity().slice(0, 5)}
					fallback={
						<li class="dash-empty">
							<Text as="p" size="sm" weight="medium">
								No activity yet
							</Text>
							<Text as="p" size="xs" tone="muted">
								Nothing changed in the last {rangeOf(pulse.range()).label}.
							</Text>
						</li>
					}
				>
					{event => (
						<li>
							<button type="button" class="dash-activity-row" data-event={event.id} onClick={() => pulse.showCustomer(event.customer.id, `[data-event="${event.id}"]`)}>
								<span class="dash-avatar" aria-hidden="true">
									{event.customer.company[0]}
								</span>
								<span class="dash-activity-text ex-truncate" title={`${event.customer.company} ${event.text}`}>
									<span class="dash-activity-name">{event.customer.company}</span> {event.text}
								</span>
								<span class="dash-activity-time ex-tabular">{formatAge(event.age)}</span>
							</button>
						</li>
					)}
				</For>
			</ul>
		</Card>
	);
}

export function Overview() {
	const pulse = usePulse();
	const size = createControlSize();
	return (
		<>
			<div class="dash-toolbar">
				<Text as="h1" size="md" weight="semibold">
					Overview
				</Text>
				<SegmentedControl aria-label="Range" size={size()} value={pulse.range()} onChange={value => pulse.setRange(value as RangeId)}>
					{ranges.map(range => (
						<SegmentedControlItem value={range.id}>{range.label}</SegmentedControlItem>
					))}
				</SegmentedControl>
			</div>
			<Stats />
			<div class="dash-grid">
				<ActiveUsers />
				<Sources />
				<Signups />
				<Activity />
			</div>
		</>
	);
}
