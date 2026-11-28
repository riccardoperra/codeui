import { Accordion, type AccordionEntry, OptionCardGroup, SegmentedControl, SegmentedControlItem, Slider, Switch, Text, TextField } from "@codeui/kit";
import AppWindow from "@lucide/solid/icons/app-window";
import Code from "@lucide/solid/icons/code";
import Palette from "@lucide/solid/icons/palette";
import TextCursor from "@lucide/solid/icons/text-cursor";
import { createEffect, createSignal, For, Show } from "solid-js";
import { type JSX } from "@solidjs/web";
import { MadeWith } from "../shared/ExampleMenu";
import { createControlSize } from "../shared/size";
import { ColorRow, SheetPicker } from "./Colors";
import { Sketch } from "./Preview";
import { presets } from "./presets";
import { useStudio } from "./studio";
import { colorKeys, gradientOf, idError, lowContrast, printColor, readBackdrop, resolve, type SectionId, type Slot, slots, type SlotKey, withAngle } from "./theme";

/**
 * The accordion moves between its headers on these keys wherever they are pressed, a field of the
 * open section included. Stopping them here leaves them to the slider, the cards or the text field.
 */
const keepKeys = (event: KeyboardEvent) => {
	if (["ArrowUp", "ArrowDown", "Home", "End"].includes(event.key)) event.stopPropagation();
};

const Section = (props: { children: JSX.Element }) => (
	<div class="ts-section" onKeyDown={keepKeys}>
		{props.children}
	</div>
);

/** Rows that belong together under a Meta label. Space sets the groups apart, not lines. */
function Group(props: { title: string; children: JSX.Element }) {
	return (
		<div class="ts-group" role="group" aria-label={props.title}>
			<Text as="div" size="xs" weight="semibold" tone="muted" class="ts-group-title">
				{props.title}
			</Text>
			{props.children}
		</div>
	);
}

/** The colour rows of one section, in their groups. */
function Rows(props: { section: Slot["section"] }) {
	const groups = [...new Set(slots.filter(item => item.section === props.section).map(item => item.group))];
	return (
		<For each={groups}>
			{group => (
				<Group title={group}>
					<For each={slots.filter(item => item.section === props.section && item.group === group)}>{item => <ColorRow slotKey={item.key} />}</For>
				</Group>
			)}
		</For>
	);
}

/** The id names the exported constant, so only a valid identifier reaches the theme. */
function IdField() {
	const studio = useStudio();
	const size = createControlSize();
	const [draft, setDraft] = createSignal<string | null>(null);
	const error = () => (draft() === null ? null : idError(draft()!));
	return (
		<TextField
			label="Id"
			size={size()}
			classes={{ input: "ts-mono" }}
			spellcheck={false}
			autocomplete="off"
			value={draft() ?? studio.theme().id}
			onChange={text => {
				setDraft(text);
				if (!idError(text)) studio.patch({ id: text }, "id");
			}}
			// The kit's TextField has no blur prop, so the draft ends through the input itself.
			ref={input => input.addEventListener("blur", () => setDraft(null))}
			validationState={error() ? "invalid" : "valid"}
			errorMessage={error()}
		/>
	);
}

function ThemeSection() {
	const studio = useStudio();
	const size = createControlSize();
	// Built once, so the cards keep their elements, and their focus, when the theme changes.
	const items = presets.map(preset => ({
		value: preset.id,
		label: preset.label,
		preview: <Sketch backdrop={preset.previewBackground} window={resolve(preset, "terminal.main")} strokes={[resolve(preset, "highlight.keywords"), resolve(preset, "highlight.function"), resolve(preset, "highlight.strings")]} />,
	}));
	return (
		<Section>
			<div class="ts-fields">
				<TextField label="Label" size={size()} placeholder="Untitled" value={studio.theme().label} onChange={studio.setLabel} />
				<IdField />
			</div>
			<Switch label="Dark mode" description="Pairs the theme with CodeImage's dark interface." checked={studio.theme().darkMode} onChange={darkMode => studio.patch({ darkMode })} />
			<OptionCardGroup label="Start from" description="Replaces every colour. Undo brings yours back." class="ts-cards" value={studio.originId()} onChange={studio.startFrom} items={items} />
		</Section>
	);
}

/** The preview background: one colour, or a gradient with a row per stop and its angle. */
function Backdrop() {
	const studio = useStudio();
	const size = createControlSize();
	const backdrop = () => readBackdrop(studio.theme().previewBackground);
	const setKind = (kind: string) => {
		const theme = studio.saved();
		const [first, second] = readBackdrop(theme.previewBackground).stops;
		// A solid keeps the first stop. A gradient runs from the current colour to the accent of the window.
		studio.patch({ previewBackground: kind === "solid" ? printColor(first) : gradientOf(first, second ?? resolve(theme, "terminal.accent")) });
	};
	return (
		<Group title="Backdrop">
			<SegmentedControl aria-label="Backdrop fill" fluid size={size()} value={backdrop().gradient ? "gradient" : "solid"} onChange={setKind}>
				<SegmentedControlItem value="solid">Solid</SegmentedControlItem>
				<SegmentedControlItem value="gradient">Gradient</SegmentedControlItem>
			</SegmentedControl>
			<For each={backdrop().stops.map((_, index) => `previewBackground.${index}` as SlotKey)}>{key => <ColorRow slotKey={key} />}</For>
			<Show when={backdrop().gradient && backdrop().angle !== null}>
				<Slider label="Angle" minValue={-180} maxValue={180} step={5} value={backdrop().angle ?? 0} onChange={angle => studio.patch({ previewBackground: withAngle(studio.saved().previewBackground, angle) }, "angle")} showValue getValueLabel={({ values }) => `${values[0]}°`} />
			</Show>
		</Group>
	);
}

const sections: { value: SectionId; title: string; icon: () => JSX.Element; content: () => JSX.Element; summary: (studio: ReturnType<typeof useStudio>) => string }[] = [
	{ value: "theme", title: "Theme", icon: () => <Palette size={16} />, content: ThemeSection, summary: studio => (studio.theme().darkMode ? "Dark" : "Light") },
	{
		value: "window",
		title: "Window",
		icon: () => <AppWindow size={16} />,
		content: () => (
			<Section>
				<Backdrop />
				<Rows section="window" />
			</Section>
		),
		summary: studio => printColor(resolve(studio.theme(), "terminal.main")),
	},
	{
		value: "syntax",
		title: "Syntax",
		icon: () => <Code size={16} />,
		content: () => (
			<Section>
				<Rows section="syntax" />
			</Section>
		),
		summary: studio => {
			const low = lowContrast(studio.theme(), "syntax");
			const keys = colorKeys.filter(key => key.startsWith("highlight.") && key !== "highlight.background");
			return low ? `${low} low contrast` : `${keys.filter(key => studio.theme().colors[key] !== undefined).length} of ${keys.length} set`;
		},
	},
	{
		value: "editor",
		title: "Editor",
		icon: () => <TextCursor size={16} />,
		content: () => (
			<Section>
				<Rows section="editor" />
			</Section>
		),
		summary: studio => {
			const low = lowContrast(studio.theme(), "editor");
			return low ? `${low} low contrast` : "Readable";
		},
	},
];

function Footer() {
	return (
		<footer class="ts-panel-footer">
			<Text size="xs" tone="muted">
				Contrast is WCAG 2, on the window.
			</Text>
			<MadeWith />
		</footer>
	);
}

/** The side panel: one section open at a time, each with its state on the header. */
export function Panel() {
	const studio = useStudio();
	// Built once. The Accordion keys its sections by entry object, so a new array would mount the
	// open section again and drop the focus and the open picker inside it.
	const items: AccordionEntry[] = sections.map(section => ({
		value: section.value,
		title: section.title,
		icon: section.icon(),
		summary: <>{section.summary(studio)}</>,
		get content() {
			return <section.content />;
		},
	}));
	return (
		<div class="ts-panel">
			{/* Not collapsible: one section is always open, and Escape inside a field cannot close the section around it. */}
			<Accordion aria-label="Theme" value={studio.section()} onChange={value => value && studio.setSection(value as SectionId)} collapsible={false} items={items} />
			<Footer />
		</div>
	);
}

/** On a phone the same sections are tabs inside a bottom sheet (DESIGN.md §8), and a picker takes their place while it is open. */
export function PanelTabs() {
	const studio = useStudio();
	const size = createControlSize();
	let panel!: HTMLDivElement;
	// The rows come back when the picker closes, so focus returns to the row that opened it.
	createEffect(
		studio.picker, (now, before) => {
			if (!now && before) queueMicrotask(() => panel.querySelector<HTMLElement>(`[data-slot="${before}"] .ts-row-main`)?.focus());
		},
	);
	return (
		<div class="ts-panel">
			<Show when={studio.picker()} keyed fallback={null}>
				{key => <SheetPicker slotKey={key} />}
			</Show>
			<div class="ts-tabs" hidden={studio.picker() !== null}>
				<SegmentedControl aria-label="Theme" fluid size={size()} value={studio.section()} onChange={value => studio.setSection(value as SectionId)}>
					<For each={sections}>{item => <SegmentedControlItem value={item.value}>{item.title}</SegmentedControlItem>}</For>
				</SegmentedControl>
				<div class="ts-tab-panel ex-scroll" role="tabpanel" aria-label={sections.find(item => item.value === studio.section())!.title} ref={panel}>
					<For each={sections}>
						{item => (
							<Show when={studio.section() === item.value}>
								<item.content />
							</Show>
						)}
					</For>
				</div>
			</div>
			<Footer />
		</div>
	);
}
