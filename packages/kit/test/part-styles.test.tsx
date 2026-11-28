import { createSignal, flush } from "solid-js";

import { cleanup, render, screen } from "@solidjs/testing-library";
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
	[stackStyles.root, "cui-stack"],
	[textStyles.root, "cui-text"],
	[optionCardStyles.itemLabel, "cui-optioncard-item-label"],
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
			variant: "inline",
		});
		return <input {...field.attributes} class={field.baseStyle()} />;
	});
	const input = screen.getByRole("textbox");
	expect(input).toHaveClass("cui-field-input");
	expect(input).toHaveAttribute("data-size", "sm");
	expect(input).toHaveAttribute("data-variant", "inline");
	flush(() => setSize("lg"));
	expect(input).toHaveAttribute("data-size", "lg");
});
