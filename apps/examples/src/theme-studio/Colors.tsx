import { Badge, Button, IconButton, Popover, PopoverContent, PopoverTrigger, Slider, Text, TextField, Tooltip } from "@codeui/kit";
import Check from "@lucide/solid/icons/check";
import ChevronLeft from "@lucide/solid/icons/chevron-left";
import TriangleAlert from "@lucide/solid/icons/triangle-exclamation-point";
import X from "@lucide/solid/icons/x";
import { createMemo, createSignal, For, Show } from "solid-js";
import { type JSX } from "@solidjs/web";
import { createIsPhone } from "../shared/media";
import { createControlSize } from "../shared/size";
import { fromOklch, isHex, type Oklch, parseColor, toHex, toOklch } from "./color";
import { useStudio } from "./studio";
import { type ColorKey, colorKeys, type Contrast, contrastOf, contrastTone, fallbackHint, printColor, readBackdrop, slot, slotAlpha, slotColor, type SlotKey, slotLabel, withSlot } from "./theme";

const ratio = (value: number) => `${value.toFixed(value < 10 ? 2 : 1)}:1`;
const isStop = (key: SlotKey) => key.startsWith("previewBackground");
/** A pasted `7ee787` counts as `#7ee787`. */
const withHash = (text: string) => (text.trim().startsWith("#") ? text.trim() : `#${text.trim()}`);

/** The WCAG figure of a colour. Under its target it gains an icon and a word: colour is never the only signal (DESIGN.md §2.4). */
function ContrastFigure(props: { value: Contrast }) {
	const tone = () => contrastTone(props.value);
	return (
		<span class="ts-contrast">
			<Show when={tone()}>
				{value => (
					<Badge tone={value()} icon={<TriangleAlert size={12} />}>
						{value() === "danger" ? "Poor" : "Low"}
					</Badge>
				)}
			</Show>
			<span class="ts-ratio ex-tabular">{ratio(props.value.ratio)}</span>
		</span>
	);
}

const steps = (count: number, at: (t: number) => Oklch) => Array.from({ length: count }, (_, index) => toHex(fromOklch(at(index / (count - 1))))).join(", ");

/**
 * The colour picker the kit does not have, composed from its parts: a hex field, one slider per
 * OKLCH channel, and the theme's other colours as swatches. Each track is painted with the range
 * its thumb moves through, so a slider shows where it leads. It previews on the artwork as it
 * moves; closing commits and Escape restores, which the row and the sheet decide.
 */
export function Picker(props: { slotKey: SlotKey }) {
	const studio = useStudio();
	const size = createControlSize();
	const key = props.slotKey;
	const before = slotColor(studio.saved(), key);
	// "None" has no colour to start from, so the sliders start at the window's.
	const start = parseColor(before) ?? parseColor(slotColor(studio.saved(), "terminal.main")) ?? { r: 128, g: 128, b: 128, a: 1 };
	const [value, setValue] = createSignal(printColor(toHex(start)));
	const [lch, setLch] = createSignal(toOklch(start));
	const [alpha, setAlpha] = createSignal(start.a);
	/** What is typed in the hex field while it is not a colour yet. */
	const [draft, setDraft] = createSignal<string | null>(null);
	const showAlpha = slotAlpha(key) || start.a < 1;

	const preview = (hex: string) => {
		setValue(hex);
		studio.setPreview(withSlot(studio.saved(), key, hex));
	};
	const move = (next: Partial<Oklch>, opacity = alpha()) => {
		setDraft(null);
		setLch(current => ({ ...current, ...next }));
		setAlpha(opacity);
		preview(toHex(fromOklch(lch(), opacity)));
	};
	const use = (text: string) => {
		const color = parseColor(text);
		if (!color) return;
		setLch(toOklch(color));
		setAlpha(color.a);
		preview(toHex(color));
	};
	const type = (text: string) => {
		setDraft(text);
		if (isHex(withHash(text))) use(withHash(text));
	};

	const tracks = createMemo(() => {
		const { l, c, h } = lch();
		const solid = toHex(fromOklch(lch()));
		return {
			lightness: steps(9, t => ({ l: t, c, h })),
			chroma: steps(9, t => ({ l, c: t * 0.4, h })),
			hue: steps(13, t => ({ l, c: Math.max(c, 0.04), h: t * 360 })),
			alpha: `${solid}00, ${solid}`,
		};
	});
	const track = (stops: string): JSX.CSSProperties => ({ "--ts-track": `linear-gradient(to right, ${stops})` });

	/** The theme's other colours, each once, as its palette. */
	const palette = createMemo(() => {
		const theme = studio.saved();
		const all = [...colorKeys.map(name => theme.colors[name]), ...readBackdrop(theme.previewBackground).stops].flatMap(text => (text && parseColor(text) ? [printColor(text)] : []));
		return [...new Set(all)].filter(hex => hex !== printColor(before)).slice(0, 18);
	});
	const figure = () => contrastOf(studio.theme(), key);

	return (
		<div class="ts-picker">
			<TextField
				label="Hex"
				size={size()}
				classes={{ input: "ts-hex" }}
				spellcheck={false}
				autocomplete="off"
				value={draft() ?? value()}
				onChange={type}
				// The kit's TextField has no blur prop, so the draft ends through the input itself.
				ref={input => input.addEventListener("blur", () => setDraft(null))}
				validationState={draft() !== null && !isHex(withHash(draft()!)) ? "invalid" : "valid"}
				errorMessage="Type 3, 4, 6 or 8 hex digits, such as #7ee787."
			/>
			<div class="ts-channel" style={track(tracks().lightness)}>
				<Slider label="Lightness" minValue={0} maxValue={100} step={0.5} value={Math.round(lch().l * 200) / 2} onChange={l => move({ l: l / 100 })} showValue getValueLabel={({ values }) => `${values[0].toFixed(1)}%`} />
			</div>
			<div class="ts-channel" style={track(tracks().chroma)}>
				<Slider label="Chroma" minValue={0} maxValue={0.4} step={0.005} value={Math.min(0.4, Math.round(lch().c * 200) / 200)} onChange={c => move({ c })} showValue getValueLabel={({ values }) => values[0].toFixed(3)} />
			</div>
			<div class="ts-channel" style={track(tracks().hue)}>
				<Slider label="Hue" minValue={0} maxValue={360} step={1} value={Math.round(lch().h)} onChange={h => move({ h })} showValue getValueLabel={({ values }) => `${values[0]}°`} />
			</div>
			<Show when={showAlpha}>
				<div class="ts-channel" data-alpha style={track(tracks().alpha)}>
					<Slider label="Opacity" minValue={0} maxValue={100} step={1} value={Math.round(alpha() * 100)} onChange={percent => move({}, percent / 100)} showValue getValueLabel={({ values }) => `${values[0]}%`} />
				</div>
			</Show>
			<Show when={palette().length}>
				<div class="ts-palette" role="group" aria-label="Colours of this theme">
					<For each={palette()}>
						{hex => (
							<Tooltip content={<span class="ts-mono">{hex}</span>} placement="top" variant="secondary">
								<button type="button" class="ts-swatch" style={{ "--ts-fill": hex }} aria-label={`Use ${hex}`} onClick={() => use(hex)} />
							</Tooltip>
						)}
					</For>
				</div>
			</Show>
			<Show when={figure()}>
				{found => (
					<div class="ts-readout" aria-live="polite">
						<Text size="xs" tone="muted">
							{found().of === slotLabel(key).toLowerCase() ? "Contrast" : `Contrast of ${found().of}`} on {found().on}
						</Text>
						<span class="ts-readout-value">
							<Show when={!contrastTone(found())}>
								<span class="ts-pass">
									<Check size={14} />
									<span class="ex-sr-only">Passes {found().minimum}:1</span>
								</span>
							</Show>
							<ContrastFigure value={found()} />
						</span>
					</div>
				)}
			</Show>
		</div>
	);
}

/**
 * One colour of the theme: swatch, name, value and contrast. The row opens its picker over the
 * panel, and while the pointer or the focus is on it the preview dims everything else.
 */
export function ColorRow(props: { slotKey: SlotKey }) {
	const studio = useStudio();
	const isPhone = createIsPhone();
	const key = props.slotKey;
	const label = slotLabel(key);
	const colorKey = isStop(key) ? null : (key as ColorKey);
	const optional = colorKey !== null && slot(colorKey).optional;
	const isSet = () => colorKey === null || studio.theme().colors[colorKey] !== undefined;
	const color = () => slotColor(studio.theme(), key);
	const figure = () => contrastOf(studio.theme(), key);
	const description = () => (isSet() ? printColor(color()) : fallbackHint(studio.theme(), colorKey!));
	const name = () => {
		const found = figure();
		const state = found ? `, contrast ${ratio(found.ratio)}${contrastTone(found) ? `, below ${found.minimum}:1` : ""}` : "";
		return `${label}, ${description()}${state}`;
	};
	const open = () => studio.picker() === key;
	let cancelled = false;

	const main = () => (
		<>
			<span class="ts-swatch" data-unset={isSet() ? undefined : ""} style={{ "--ts-fill": color() }} />
			<span class="ts-row-text">
				<span class="ts-row-name">{label}</span>
				<span class="ts-row-value" data-hex={isSet() ? "" : undefined}>
					{description()}
				</span>
			</span>
			<Show when={figure()}>{found => <ContrastFigure value={found()} />}</Show>
		</>
	);

	return (
		<div
			class="ts-row"
			data-slot={key}
			data-open={open() ? "" : undefined}
			onPointerEnter={() => studio.setSpotlight(key)}
			onPointerLeave={() => studio.spotlight() === key && studio.setSpotlight(null)}
			onFocusIn={() => studio.setSpotlight(key)}
			onFocusOut={() => studio.spotlight() === key && studio.setSpotlight(null)}
		>
			<Show
				when={!isPhone()}
				fallback={
					// On a phone the picker takes the row list's place inside the sheet, so the preview above stays in view.
					<button type="button" class="ts-row-main" aria-label={name()} onClick={() => studio.setPicker(key)}>
						{main()}
					</button>
				}
			>
				<Popover
					open={open()}
					onOpenChange={next => {
						if (next) {
							cancelled = false;
							studio.setPicker(key);
						} else if (open()) studio.closePicker(!cancelled);
					}}
					placement="bottom"
					fitViewport
					// Anchored to the row, as wide as the panel: the picker opens over the panel, never over the artwork (DESIGN.md §9.5).
					getAnchorRect={anchor => {
						const row = anchor?.getBoundingClientRect();
						const side = anchor?.closest(".ts-side")?.getBoundingClientRect();
						return row && side ? { x: side.x, y: row.y, width: side.width, height: row.height } : row;
					}}
				>
					<PopoverTrigger class="ts-row-main" aria-label={name()}>
						{main()}
					</PopoverTrigger>
					<PopoverContent class="ts-picker-popover" title={label} onEscapeKeyDown={() => (cancelled = true)}>
						<Picker slotKey={key} />
					</PopoverContent>
				</Popover>
			</Show>
			<span class="ts-row-end">
				<Show when={optional && isSet()}>
					<Tooltip content={`Clear: ${fallbackHint({ ...studio.theme(), colors: { ...studio.theme().colors, [colorKey!]: undefined } }, colorKey!)}`} placement="left" variant="secondary">
						<IconButton variant="secondary" ghost size={isPhone() ? "md" : "xs"} aria-label={`Clear ${label}`} onClick={() => studio.setColor(key, undefined)}>
							<X size={14} />
						</IconButton>
					</Tooltip>
				</Show>
			</span>
		</div>
	);
}

/** The picker inside the phone sheet: it replaces the rows, with the way back at the top. */
export function SheetPicker(props: { slotKey: SlotKey }) {
	const studio = useStudio();
	return (
		<div class="ts-sheet-picker">
			<div class="ts-sheet-picker-head">
				<IconButton variant="secondary" ghost size="md" aria-label="Back to the colours" ref={element => queueMicrotask(() => element.focus())} onClick={() => studio.closePicker(true)}>
					<ChevronLeft size={16} />
				</IconButton>
				<Text as="h2" size="sm" weight="semibold">
					{slotLabel(props.slotKey)}
				</Text>
				<span class="ex-header-spacer" />
				<Button variant="secondary" ghost size="md" onClick={() => studio.closePicker(false)}>
					Cancel
				</Button>
			</div>
			<Picker slotKey={props.slotKey} />
		</div>
	);
}
