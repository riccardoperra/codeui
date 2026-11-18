import { cleanup, render } from "solid-testing-library";
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
	'[data-cui="icon-button"]',
	'input[aria-label="Name"]',
	"textarea",
	'[data-cui="select-trigger"]',
	'[role="spinbutton"]',
	'[data-cui="segmentedControl"]',
];

function expectRowHeight(container: Element, expected: number) {
	for (const selector of selectors) {
		const control = container.querySelector(selector);
		expect(control, selector).toBeInstanceOf(HTMLElement);
		expect(getComputedStyle(control!).boxSizing, selector).toBe("border-box");
		expect(control!.getBoundingClientRect().height, selector).toBe(expected);
	}

	const track = container.querySelector('[data-cui="segmentedControl"]')!;
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
