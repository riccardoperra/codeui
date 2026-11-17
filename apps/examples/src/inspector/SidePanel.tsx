import { Accordion, type AccordionEntry, SegmentedControl, SegmentedControlItem, Text } from "@codeui/kit";
import FlaskConical from "lucide-solid/icons/flask-conical";
import Gauge from "lucide-solid/icons/gauge";
import ListTree from "lucide-solid/icons/list-tree";
import { createSignal, For, type JSX, Match, Switch } from "solid-js";
import { MadeWith } from "../shared/ExampleMenu";
import { formatNumber } from "../shared/format";
import { modKey } from "../shared/hotkey";
import { useBench } from "./bench";
import { LoadLab } from "./LoadLab";
import { Outline } from "./Outline";
import { Scenarios } from "./Scenarios";
import { scenarios } from "./invoice/scenarios";

const rovingKeys = ["ArrowUp", "ArrowDown", "Home", "End"];

/**
 * The kit's Accordion moves between its headers on the arrow keys, Home and End, and it also hears
 * them from inside an open section. Stopping them here leaves them to the list and the slider.
 */
const Section = (props: { children: JSX.Element }) => <div onKeyDown={event => rovingKeys.includes(event.key) && event.stopPropagation()}>{props.children}</div>;

/** The side panel: one section open at a time (DESIGN.md §8), each with a summary on its header. */
export function SidePanel() {
	const bench = useBench();
	// Built once. The kit's Accordion keys its sections by entry object, so a new array on every
	// change would remount the open section and drop its state. Each summary is a live text node
	// instead, and each `content` a getter, so a section is only created when it opens.
	const items: AccordionEntry[] = [
		{ value: "outline", title: "Outline", icon: <ListTree size={16} />, summary: <>{formatNumber(bench.pages())} pages</>, get content() { return <Section><Outline /></Section>; } },
		{ value: "scenarios", title: "Scenarios", icon: <FlaskConical size={16} />, summary: `${scenarios.length} to run`, get content() { return <Section><Scenarios /></Section>; } },
		{ value: "lab", title: "Load lab", icon: <Gauge size={16} />, summary: <>{formatNumber(bench.rows())} rows</>, get content() { return <Section><LoadLab /></Section>; } },
	];
	return (
		<div class="pmi-side-body">
			<Accordion aria-label="Workbench" defaultValue="scenarios" items={items} />
			<footer class="pmi-side-footer">
				<Text size="xs" tone="muted">
					Inspect with {modKey()}⇧D
				</Text>
				<MadeWith />
			</footer>
		</div>
	);
}

const sections = { outline: "Outline", scenarios: "Scenarios", lab: "Load lab" } as const;
type SectionId = keyof typeof sections;

/**
 * On a phone the panel is a sheet, and its sections are tabs (DESIGN.md §8). The kit's segmented
 * control is a tab list, and it is the borderless one.
 */
export function SidePanelTabs() {
	const bench = useBench();
	const [section, setSection] = createSignal<SectionId>("scenarios");
	return (
		<div class="pmi-side-body">
			<SegmentedControl aria-label="Workbench section" size="md" value={section()} onChange={value => setSection(value as SectionId)}>
				<For each={Object.keys(sections) as SectionId[]}>{id => <SegmentedControlItem value={id}>{sections[id]}</SegmentedControlItem>}</For>
			</SegmentedControl>
			<Switch>
				<Match when={section() === "outline"}>
					<Outline onJump={() => bench.setSheetOpen(false)} />
				</Match>
				<Match when={section() === "scenarios"}>
					<Scenarios />
				</Match>
				<Match when={section() === "lab"}>
					<LoadLab />
				</Match>
			</Switch>
			<footer class="pmi-side-footer">
				<MadeWith />
			</footer>
		</div>
	);
}
