import { cleanup, render } from "@solidjs/testing-library";
import { Combobox } from "../src/components/Combobox/Combobox";
import { Button } from "../src/components/Button/Button";
import { IconButton } from "../src/components/IconButton/IconButton";
import { NumberField } from "../src/components/NumberField/NumberField";
import { Select } from "../src/components/Select/Select";
import { TextArea } from "../src/components/TextArea/TextArea";
import { TextField } from "../src/components/TextField/TextField";
import { SegmentedControl } from "../src/components/SegmentedControl/SegmentedControl";
import { SegmentedControlItem } from "../src/components/SegmentedControl/SegmentedControlItem";

afterEach(cleanup);

type Size = (typeof sizes)[number];
type Density = (typeof densities)[number];

const sizes = ["xs", "sm", "md", "lg"] as const;
const densities = ["comfortable", "compact", "touch"] as const;
const heights = {
	comfortable: [28, 36, 44, 52],
	compact: [24, 32, 38, 46],
	touch: [32, 40, 50, 58],
};

const row = (size?: Size, density?: Density) =>
	render(() => (
		<div data-cui-density={density}>
			<Button size={size}>Save</Button>
			<IconButton aria-label="Copy" size={size}>
				<span aria-hidden="true">+</span>
			</IconButton>
			<TextField aria-label="Name" size={size} />
			<TextArea aria-label="Notes" size={size} />
			<Select aria-label="Format" options={["PNG", "SVG"]} size={size} />
			<NumberField aria-label="Width" size={size} />
			<SegmentedControl aria-label="Mode" size={size} defaultValue="a">
				<SegmentedControlItem value="a">A</SegmentedControlItem>
				<SegmentedControlItem value="b">B</SegmentedControlItem>
			</SegmentedControl>
		</div>
	)).container;

const selectors = [
	'[data-cui="button"]',
	'[data-cui="iconbutton"]',
	'input[aria-label="Name"]',
	"textarea",
	'[data-cui="select-trigger"]',
	'[role="spinbutton"]',
	'[data-cui="segmentedcontrol"]',
];

function expectRowHeight(container: Element, expected: number) {
	for (const selector of selectors) {
		const control = container.querySelector(selector);
		expect(control, selector).toBeInstanceOf(HTMLElement);
		expect(getComputedStyle(control!).boxSizing, selector).toBe("border-box");
		expect(control!.getBoundingClientRect().height, selector).toBe(expected);
	}

	const track = container.querySelector('[data-cui="segmentedcontrol"]')!;
	const style = getComputedStyle(track);
	const innerHeight =
		expected - parseFloat(style.paddingTop) - parseFloat(style.paddingBottom);
	for (const segment of track.querySelectorAll('[role="tab"]'))
		expect(segment.getBoundingClientRect().height).toBe(innerHeight);
}

it.each(densities)("aligns all four control sizes at %s density", density => {
	sizes.forEach((size, index) =>
		expectRowHeight(row(size, density), heights[density][index]),
	);
});

it("defaults to a 36px control height without a reset", () => {
	expectRowHeight(row(), 36);
});

const fields = selectors.slice(2, 6);

it("uses Button md typography for medium fields", () => {
	const container = row("md", "comfortable");
	const button = getComputedStyle(container.querySelector(selectors[0])!);
	expect(button.fontSize).toBe("16px");
	for (const selector of fields)
		expect(getComputedStyle(container.querySelector(selector)!).fontSize, selector).toBe(
			button.fontSize,
		);
});

it.each(sizes)("keeps %s field text at 16px at touch density", size => {
	const container = row(size, "touch");
	for (const selector of fields)
		expect(getComputedStyle(container.querySelector(selector)!).fontSize, selector).toBe(
			"16px",
		);
});

it.each(["sm", "md"] as const)(
	"uses 16px for %s combobox input at touch density",
	size => {
		const { getByRole } = render(() => (
			<div data-cui-density="touch">
				<Combobox aria-label="Format" options={["PNG", "SVG"]} size={size} />
			</div>
		));
		expect(getComputedStyle(getByRole("combobox")).fontSize).toBe("16px");
	},
);
