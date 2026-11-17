import { createSignal, For, type JSX, onCleanup, onMount, Show } from "solid-js";
import { parseColor, readableOn } from "./color";
import type { Token } from "./highlight";
import { findSample } from "./samples";
import { useStudio } from "./studio";
import { type ColorKey, highlightKeys, readBackdrop, resolve, sourceOf } from "./theme";

/** The artwork's own measures, in its own pixels. The stage scales the whole box to fit the island. */
const art = { width: 760, height: 560, lineHeight: 22 };
/** macOS window controls. They belong to the picture of a window, not to the theme. */
const trafficLights = ["#ff5f57", "#febc2e", "#28c840"];
/** How far a part fades while another colour is in the spotlight. */
const dimmed = "0.22";

// One rule per key, written once: a token names its key, and the theme reaches it as a custom property.
const tokenRules = document.createElement("style");
tokenRules.textContent = highlightKeys.map(key => `.ts-art [data-key="${key}"]{color:var(--k-${key});opacity:var(--o-${key},1)}`).join("");
document.head.append(tokenRules);

const px = (value: number) => `${value}px`;

/**
 * The theme as custom properties on the artwork. Colours come straight from the data, fallbacks
 * applied as CodeImage applies them, so the CSS of the preview holds no colour of its own.
 */
export function createArtStyle() {
	const studio = useStudio();
	return (): JSX.CSSProperties => {
		const theme = studio.theme();
		// While a picker is open the whole picture stays lit, so the colour is judged among the others.
		const spot = studio.picker() ? null : studio.spotlight();
		const color = (key: ColorKey) => resolve(theme, key);
		/** A part stays lit when it uses the colour in the spotlight, directly or by inheriting it. */
		const lit = (...keys: ColorKey[]) => (!spot || keys.some(key => key === spot || sourceOf(theme, key) === spot) ? "1" : dimmed);
		const style: Record<string, string> = {
			"--ts-backdrop": theme.previewBackground,
			"--ts-main": color("terminal.main"),
			"--ts-text": color("terminal.text"),
			"--ts-accent": color("terminal.accent"),
			"--ts-tabs": color("tabs.background"),
			"--ts-tab-active": color("tabs.activeTabBackground"),
			"--ts-tab-inactive": color("tabs.inactiveTabBackground"),
			"--ts-tab-text": color("tabs.textColor"),
			"--ts-selection": color("selection.backgroundColor"),
			"--ts-active-line": color("selection.activeLine"),
			"--ts-cursor": color("cursor.color"),
			"--ts-gutter": color("lineNumbers.color"),
			"--ts-popup": color("autocomplete.background"),
			"--ts-popup-border": color("autocomplete.border"),
			"--ts-popup-selected": color("autocomplete.selectedBackground"),
			"--ts-popup-selected-text": color("autocomplete.selectedColor"),
			"--ts-line": px(art.lineHeight),
			"--o-gutter": lit("lineNumbers.color"),
			"--o-cursor": lit("cursor.color"),
			"--o-tabs": lit("tabs.textColor"),
			"--o-title": lit("terminal.text"),
			"--o-accent": lit("terminal.accent"),
			"--o-popup": lit("autocomplete.background", "autocomplete.border", "autocomplete.selectedBackground", "autocomplete.selectedColor"),
		};
		for (const key of highlightKeys) {
			style[`--k-${key}`] = color(`highlight.${key}`);
			style[`--o-${key}`] = lit(`highlight.${key}`);
		}
		return style as JSX.CSSProperties;
	};
}

export const Line = (props: { tokens: Token[] }) => (
	<span class="ts-line">
		<For each={props.tokens}>
			{token => (
				<span data-key={token.key} data-style={token.style}>
					{token.text}
				</span>
			)}
		</For>
	</span>
);

const Dots = () => (
	<span class="ts-dots" aria-hidden="true">
		<For each={trafficLights}>{color => <b style={{ background: color }} />}</For>
	</span>
);

/**
 * A CodeImage frame: the preview background behind a window. One line is the active line, one
 * range is selected, and an autocomplete popup is open under the caret, so every colour of the
 * theme is on screen at once.
 */
function Frame() {
	const studio = useStudio();
	const sample = () => findSample(studio.sample());
	const at = (line: number, column: number, length = 0): JSX.CSSProperties => ({ top: px(line * art.lineHeight), left: `${column}ch`, width: length ? `${length}ch` : undefined });
	return (
		<div class="ts-frame" role="img" aria-label={`Preview of ${studio.theme().label} on ${sample().name} code`}>
			<div class="ts-window">
				<div class="ts-bar">
					<Dots />
					<span class="ts-tab" data-active>
						{sample().file}
					</span>
					<span class="ts-tab">notes.md</span>
					<span class="ts-title">+</span>
				</div>
				<div class="ts-code">
					<div class="ts-gutter">
						<For each={sample().lines}>{(_, index) => <span>{index() + 1}</span>}</For>
					</div>
					<div class="ts-source">
						<span class="ts-active-line" style={at(sample().cursor.line, 0)} />
						<span class="ts-selection" style={at(sample().selection.line, sample().selection.column, sample().selection.length)} />
						<pre>
							<For each={sample().lines}>{tokens => <Line tokens={tokens} />}</For>
						</pre>
						<span class="ts-cursor" style={at(sample().cursor.line, sample().cursor.column)} />
						<ul class="ts-popup" style={at(sample().cursor.line + 1, sample().cursor.column)}>
							<For each={sample().complete}>{(item, index) => <li data-selected={index() === 0 ? "" : undefined}>{item}</li>}</For>
						</ul>
					</div>
				</div>
			</div>
		</div>
	);
}

/** The theme as CodeImage lists it in its theme picker: the label on the preview background, over a small window. */
function Card() {
	const studio = useStudio();
	const sample = () => findSample(studio.sample());
	// The label has no colour of its own in the theme, so it takes the one that reads on the first stop.
	const ink = () => readableOn(parseColor(readBackdrop(studio.theme().previewBackground).stops[0]) ?? { r: 0, g: 0, b: 0, a: 1 });
	return (
		<div class="ts-card-stage" role="img" aria-label={`${studio.theme().label} as a card of CodeImage's theme picker`}>
			<div class="ts-card">
				<span class="ts-card-label" style={{ color: ink() }}>
					{studio.theme().label || "Untitled"}
				</span>
				<div class="ts-card-window">
					<Dots />
					<pre class="ts-source">
						<For each={sample().lines.slice(0, 7)}>{tokens => <Line tokens={tokens} />}</For>
					</pre>
				</div>
			</div>
		</div>
	);
}

/**
 * The content island's viewport. The artwork is centred and scaled to fit. Only the size of the
 * island changes that scale, never something that opens, and both views fill the same box.
 */
export function Stage() {
	const studio = useStudio();
	const style = createArtStyle();
	const [room, setRoom] = createSignal({ width: Infinity, height: Infinity });
	let viewport!: HTMLDivElement;
	onMount(() => {
		const update = () => {
			const computed = getComputedStyle(viewport);
			setRoom({
				width: viewport.clientWidth - parseFloat(computed.paddingLeft) - parseFloat(computed.paddingRight),
				height: viewport.clientHeight - parseFloat(computed.paddingTop) - parseFloat(computed.paddingBottom),
			});
		};
		const observer = new ResizeObserver(update);
		observer.observe(viewport);
		onCleanup(() => observer.disconnect());
	});
	const scale = () => Math.min(1, room().width / art.width, room().height / art.height);
	return (
		<div class="ts-viewport" ref={viewport}>
			{/* A scaled element keeps its unscaled layout box, so this wrapper takes the scaled size. */}
			<div class="ts-zoom" style={{ width: px(art.width * scale()), height: px(art.height * scale()) }}>
				<div class="ts-art" data-live={studio.picker() ? "" : undefined} style={{ ...style(), width: px(art.width), height: px(art.height), transform: `scale(${scale()})` }}>
					<Show when={studio.view() === "frame"} fallback={<Card />}>
						<Frame />
					</Show>
				</div>
			</div>
		</div>
	);
}

/** A window in a few strokes, in a theme's own colours: the preview of a "Start from" card (DESIGN.md §9.4). */
export function Sketch(props: { backdrop: string; window: string; strokes: string[] }) {
	return (
		<span class="ts-sketch" style={{ background: props.backdrop }}>
			<span class="ts-sketch-window" style={{ background: props.window }}>
				<For each={props.strokes}>{color => <i style={{ background: color }} />}</For>
			</span>
		</span>
	);
}
