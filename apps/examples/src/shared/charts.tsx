import { createMemo, createSignal, For, Index, type JSX, onCleanup, onMount, Show } from "solid-js";
import "./charts.css";

/** `primary` is the series the chart is about. `comparison` is the period or target it is read against. */
export type Tone = "primary" | "comparison";

export type Series = { name: string; values: readonly number[]; tone: Tone };

type ChartProps = {
	"aria-label": string;
	labels: readonly string[];
	series: readonly Series[];
	format: (value: number) => string;
	height?: number;
};

const pad = { top: 8, right: 8, bottom: 22, left: 44 };

/** Round axis steps: 1, 2 or 5 times a power of ten. */
function ticks(max: number, count = 4) {
	const raw = max / count || 1;
	const power = 10 ** Math.floor(Math.log10(raw));
	const step = [1, 2, 5, 10].map(m => m * power).find(s => s >= raw) ?? raw;
	return Array.from({ length: Math.ceil(max / step) + 1 }, (_, i) => i * step);
}

function createWidth() {
	const [width, setWidth] = createSignal(0);
	let element!: HTMLDivElement;
	onMount(() => {
		const observer = new ResizeObserver(([entry]) => setWidth(entry.contentRect.width));
		observer.observe(element);
		onCleanup(() => observer.disconnect());
	});
	return { width, ref: (el: HTMLDivElement) => (element = el) };
}

/** Keeps `index` inside the chart, and lets the arrow keys move it, so the readout works without a pointer. */
function createActiveIndex(count: () => number) {
	const [active, setActive] = createSignal<number>();
	const onKeyDown: JSX.EventHandler<HTMLDivElement, KeyboardEvent> = event => {
		const last = count() - 1;
		const current = active() ?? last;
		const next = { ArrowLeft: current - 1, ArrowRight: current + 1, Home: 0, End: last }[event.key];
		if (next === undefined) return;
		event.preventDefault();
		setActive(Math.min(last, Math.max(0, next)));
	};
	return { active, setActive, onKeyDown, onFocus: () => setActive(v => v ?? count() - 1), onBlur: () => setActive(undefined) };
}

function Tooltip(props: { title: string; series: readonly Series[]; index: number; format: (value: number) => string; x: number; width: number }) {
	// The readout flips to the other side of the crosshair past the middle, so it never leaves the chart.
	const style = (): JSX.CSSProperties =>
		props.x > props.width / 2 ? { right: `${props.width - props.x + 12}px` } : { left: `${props.x + 12}px` };
	return (
		<div class="chart-tooltip" style={style()} aria-hidden="true">
			<span class="chart-tooltip-title">{props.title}</span>
			<For each={props.series}>
				{series => (
					<span class="chart-tooltip-row">
						<span class="chart-key" data-tone={series.tone} />
						{series.name}
						<span class="chart-tooltip-value">{props.format(series.values[props.index])}</span>
					</span>
				)}
			</For>
		</div>
	);
}

/** The same numbers as a table, for screen readers. */
function DataTable(props: Pick<ChartProps, "aria-label" | "labels" | "series" | "format">) {
	return (
		<table class="ex-sr-only">
			<caption>{props["aria-label"]}</caption>
			<thead>
				<tr>
					<th scope="col">Period</th>
					<For each={props.series}>{series => <th scope="col">{series.name}</th>}</For>
				</tr>
			</thead>
			<tbody>
				<For each={props.labels}>
					{(label, index) => (
						<tr>
							<th scope="row">{label}</th>
							<For each={props.series}>{series => <td>{props.format(series.values[index()])}</td>}</For>
						</tr>
					)}
				</For>
			</tbody>
		</table>
	);
}

export function ChartLegend(props: { series: readonly Pick<Series, "name" | "tone">[] }) {
	return (
		<div class="chart-legend">
			<For each={props.series}>
				{series => (
					<span class="chart-legend-item">
						<span class="chart-key" data-tone={series.tone} />
						{series.name}
					</span>
				)}
			</For>
		</div>
	);
}

/** Change over time. The first primary series gets a soft area under it. */
export function LineChart(props: ChartProps) {
	const { width, ref } = createWidth();
	const height = () => props.height ?? 220;
	const index = createActiveIndex(() => props.labels.length);
	const steps = createMemo(() => ticks(Math.max(...props.series.flatMap(s => s.values), 1)));
	const max = () => steps().at(-1)!;
	const innerWidth = () => Math.max(0, width() - pad.left - pad.right);
	const innerHeight = () => height() - pad.top - pad.bottom;
	const x = (i: number) => pad.left + (props.labels.length > 1 ? (i / (props.labels.length - 1)) * innerWidth() : 0);
	const y = (value: number) => pad.top + innerHeight() - (value / max()) * innerHeight();
	const path = (values: readonly number[]) => values.map((v, i) => `${i ? "L" : "M"}${x(i).toFixed(1)} ${y(v).toFixed(1)}`).join("");
	const area = () => props.series.find(s => s.tone === "primary");
	// About one axis label per 72px, counted back from the last point, so the newest date is always named.
	const every = () => Math.max(1, Math.ceil(props.labels.length / Math.max(1, Math.floor(innerWidth() / 72))));

	const onPointerMove: JSX.EventHandler<HTMLDivElement, PointerEvent> = event => {
		const offset = event.clientX - event.currentTarget.getBoundingClientRect().left - pad.left;
		const nearest = Math.round((offset / (innerWidth() || 1)) * (props.labels.length - 1));
		index.setActive(Math.min(props.labels.length - 1, Math.max(0, nearest)));
	};

	return (
		<div
			ref={ref}
			class="chart"
			tabIndex={0}
			role="group"
			aria-label={`${props["aria-label"]}. Use the arrow keys to read values.`}
			onPointerMove={onPointerMove}
			onPointerLeave={() => index.setActive(undefined)}
			onKeyDown={index.onKeyDown}
			onFocus={index.onFocus}
			onBlur={index.onBlur}
		>
			<svg height={height()} aria-hidden="true">
				<For each={steps()}>
					{step => (
						<>
							<line class="chart-grid" x1={pad.left} x2={width() - pad.right} y1={y(step)} y2={y(step)} />
							<text class="chart-axis" x={pad.left - 8} y={y(step)} text-anchor="end" dominant-baseline="middle">
								{props.format(step)}
							</text>
						</>
					)}
				</For>
				<Index each={props.labels}>
					{(label, i) => (
						<Show when={(props.labels.length - 1 - i) % every() === 0}>
							<text class="chart-axis" x={x(i)} y={height() - 4} text-anchor={i === 0 ? "start" : i === props.labels.length - 1 ? "end" : "middle"}>
								{label()}
							</text>
						</Show>
					)}
				</Index>
				<Show when={area()}>
					{series => (
						<path
							class="chart-area"
							d={`${path(series().values)}L${x(series().values.length - 1)} ${y(0)}L${x(0)} ${y(0)}Z`}
						/>
					)}
				</Show>
				<For each={props.series}>{series => <path class="chart-line" data-tone={series.tone} d={path(series.values)} />}</For>
				<Show when={index.active() !== undefined}>
					<line class="chart-crosshair" x1={x(index.active()!)} x2={x(index.active()!)} y1={pad.top} y2={pad.top + innerHeight()} />
					<For each={props.series}>
						{series => <circle class="chart-dot" data-tone={series.tone} cx={x(index.active()!)} cy={y(series.values[index.active()!])} r="4" />}
					</For>
				</Show>
			</svg>
			<Show when={index.active() !== undefined}>
				<Tooltip title={props.labels[index.active()!]} series={props.series} index={index.active()!} format={props.format} x={x(index.active()!)} width={width()} />
			</Show>
			<DataTable aria-label={props["aria-label"]} labels={props.labels} series={props.series} format={props.format} />
		</div>
	);
}

/** Magnitude per period. Bars of one period sit side by side, 2px apart. */
export function BarChart(props: ChartProps) {
	const { width, ref } = createWidth();
	const height = () => props.height ?? 220;
	const index = createActiveIndex(() => props.labels.length);
	const steps = createMemo(() => ticks(Math.max(...props.series.flatMap(s => s.values), 1)));
	const max = () => steps().at(-1)!;
	const innerWidth = () => Math.max(0, width() - pad.left - pad.right);
	const innerHeight = () => height() - pad.top - pad.bottom;
	const band = () => innerWidth() / props.labels.length;
	const barWidth = () => Math.max(2, Math.min(24, (band() * 0.7 - 2 * (props.series.length - 1)) / props.series.length));
	const groupWidth = () => barWidth() * props.series.length + 2 * (props.series.length - 1);
	const center = (i: number) => pad.left + band() * (i + 0.5);
	const y = (value: number) => pad.top + innerHeight() - (value / max()) * innerHeight();
	const every = () => Math.max(1, Math.ceil(props.labels.length / Math.max(1, Math.floor(innerWidth() / 56))));
	// Rounded at the data end, square on the baseline.
	const bar = (left: number, value: number) => {
		const top = y(value);
		const bottom = y(0);
		const radius = Math.min(4, barWidth() / 2, bottom - top);
		return `M${left} ${bottom}V${top + radius}Q${left} ${top} ${left + radius} ${top}H${left + barWidth() - radius}Q${left + barWidth()} ${top} ${left + barWidth()} ${top + radius}V${bottom}Z`;
	};

	const onPointerMove: JSX.EventHandler<HTMLDivElement, PointerEvent> = event => {
		const offset = event.clientX - event.currentTarget.getBoundingClientRect().left - pad.left;
		const hovered = Math.floor(offset / (band() || 1));
		index.setActive(hovered >= 0 && hovered < props.labels.length ? hovered : undefined);
	};

	return (
		<div
			ref={ref}
			class="chart"
			tabIndex={0}
			role="group"
			aria-label={`${props["aria-label"]}. Use the arrow keys to read values.`}
			onPointerMove={onPointerMove}
			onPointerLeave={() => index.setActive(undefined)}
			onKeyDown={index.onKeyDown}
			onFocus={index.onFocus}
			onBlur={index.onBlur}
		>
			<svg height={height()} aria-hidden="true">
				<For each={steps()}>
					{step => (
						<>
							<line class="chart-grid" x1={pad.left} x2={width() - pad.right} y1={y(step)} y2={y(step)} />
							<text class="chart-axis" x={pad.left - 8} y={y(step)} text-anchor="end" dominant-baseline="middle">
								{props.format(step)}
							</text>
						</>
					)}
				</For>
				<Index each={props.labels}>
					{(label, i) => (
						<>
							<Show when={i % every() === 0}>
								<text class="chart-axis" x={center(i)} y={height() - 4} text-anchor="middle">
									{label()}
								</text>
							</Show>
							<For each={props.series}>
								{(series, s) => (
									<path
										class="chart-bar"
										data-tone={series.tone}
										data-dim={index.active() !== undefined && index.active() !== i}
										d={bar(center(i) - groupWidth() / 2 + s() * (barWidth() + 2), series.values[i])}
									/>
								)}
							</For>
						</>
					)}
				</Index>
			</svg>
			<Show when={index.active() !== undefined}>
				<Tooltip title={props.labels[index.active()!]} series={props.series} index={index.active()!} format={props.format} x={center(index.active()!)} width={width()} />
			</Show>
			<DataTable aria-label={props["aria-label"]} labels={props.labels} series={props.series} format={props.format} />
		</div>
	);
}

/** A ranked list with a bar per row. Every value is printed, so nothing depends on hover. */
export function BarList(props: { items: readonly { label: string; value: number }[]; format: (value: number) => string }) {
	const max = () => Math.max(...props.items.map(item => item.value), 1);
	return (
		<ul class="bar-list">
			<For each={props.items}>
				{item => (
					<li class="bar-list-row">
						<span class="bar-list-label ex-truncate">{item.label}</span>
						<span class="bar-list-value">{props.format(item.value)}</span>
						<span class="bar-list-track" aria-hidden="true">
							<span class="bar-list-fill" style={{ width: `${(item.value / max()) * 100}%`, display: "block" }} />
						</span>
					</li>
				)}
			</For>
		</ul>
	);
}

/** The shape of a trend inside a stat tile. Decorative: the tile prints the number and its change. */
export function Sparkline(props: { values: readonly number[]; width?: number; height?: number }) {
	const width = () => props.width ?? 72;
	const height = () => props.height ?? 24;
	const d = () => {
		const min = Math.min(...props.values);
		const range = Math.max(...props.values) - min || 1;
		return props.values
			.map((v, i) => `${i ? "L" : "M"}${((i / (props.values.length - 1)) * width()).toFixed(1)} ${(height() - 2 - ((v - min) / range) * (height() - 4)).toFixed(1)}`)
			.join("");
	};
	return (
		<svg class="sparkline" width={width()} height={height()} aria-hidden="true">
			<path class="chart-line" data-tone="primary" d={d()} />
		</svg>
	);
}
