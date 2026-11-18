import { createSignal } from "solid-js";
import { cleanup, render, screen } from "solid-testing-library";
import {
	createBaseFieldProps,
	optionCardStyles,
	progressStyles,
	sliderStyles,
	stackStyles,
	switchStyles,
	textStyles,
} from "../src";

it.each([
	[stackStyles.root, "cui-stack-root"],
	[textStyles.root, "cui-text-root"],
	[optionCardStyles.itemLabel, "cui-option-card-itemLabel"],
	[switchStyles.control, "cui-switch-control"],
	[progressStyles.track, "cui-progress-track"],
	[sliderStyles.track, "cui-slider-track"],
	[sliderStyles.fill, "cui-slider-fill"],
] as const)("returns the class for custom markup", (style, base) => {
	expect(style()).toBe(base);
});

afterEach(cleanup);

it("keeps custom field attributes in sync with its props", () => {
	const [size, setSize] = createSignal<"sm" | "lg">("sm");
	render(() => {
		const field = createBaseFieldProps({
			get size() {
				return size();
			},
			theme: "inline",
		});
		return <input {...field.attributes} class={field.baseStyle()} />;
	});
	const input = screen.getByRole("textbox");
	expect(input).toHaveClass("cui-field-baseFieldVariants");
	expect(input).toHaveAttribute("data-size", "sm");
	expect(input).toHaveAttribute("data-theme", "inline");
	setSize("lg");
	expect(input).toHaveAttribute("data-size", "lg");
});
