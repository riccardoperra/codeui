import { cleanup, render } from "solid-testing-library";
import { Button } from "../src/components/Button/Button";
import { TextField } from "../src/components/TextField/TextField";
import { SegmentedControl } from "../src/components/SegmentedControl/SegmentedControl";
import { SegmentedControlItem } from "../src/components/SegmentedControl/SegmentedControlItem";

afterEach(cleanup);

// The page has no box-sizing reset, like a CSS-only consumer of @codeui/styles.
const height = (container: Element, selector: string) =>
	container.querySelector(selector)!.getBoundingClientRect().height;

const row = (size: "xs" | "sm" | "md" | "lg" | "xl") =>
	render(() => (
		<div>
			<Button size={size}>Save</Button>
			<TextField aria-label="Name" size={size} />
			<SegmentedControl aria-label="Mode" size={size} defaultValue="a">
				<SegmentedControlItem value="a">A</SegmentedControlItem>
				<SegmentedControlItem value="b">B</SegmentedControlItem>
			</SegmentedControl>
		</div>
	)).container;

it("sizes kit controls with border-box without a page reset", () => {
	const container = row("sm");
	for (const selector of [
		'[data-cui="button"]',
		'[data-cui="text-field-input"]',
		'[data-cui="segmentedControl"]',
	])
		expect(getComputedStyle(container.querySelector(selector)!).boxSizing).toBe(
			"border-box",
		);
});

it.each(["xs", "sm", "lg", "xl"] as const)(
	"aligns Button, TextField and SegmentedControl at size %s",
	size => {
		const container = row(size);
		const button = height(container, '[data-cui="button"]');
		expect(height(container, '[data-cui="text-field-input"]')).toBe(button);
		expect(height(container, '[data-cui="segmentedControl"]')).toBe(button);
	},
);

// md is left out: Button md is 40px, field md is 36px (40px at ≤768px) and segmented md is 36px.
// The control size scale decision will align it.
