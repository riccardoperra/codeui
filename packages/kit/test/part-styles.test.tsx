import {
	optionCardStyles,
	progressStyles,
	sliderStyles,
	stackStyles,
	switchStyles,
	textStyles,
} from "../src";

// A style function is how custom markup gets a part's look. Each variant that
// changes the CSS must change the class it returns, or custom markup silently
// renders the default.
it.each([
	["stack root gap", () => stackStyles.root({ gap: "6" }), () => stackStyles.root()],
	[
		"stack root direction",
		() => stackStyles.root({ direction: "row" }),
		() => stackStyles.root(),
	],
	["text root size", () => textStyles.root({ size: "lg" }), () => textStyles.root()],
	["text root tone", () => textStyles.root({ tone: "muted" }), () => textStyles.root()],
	[
		"option card label tile",
		() => optionCardStyles.itemLabel({ variant: "tile" }),
		() => optionCardStyles.itemLabel({ variant: "card" }),
	],
	[
		"switch control sm",
		() => switchStyles.control({ size: "sm" }),
		() => switchStyles.control({ size: "md" }),
	],
	[
		"progress track md",
		() => progressStyles.track({ size: "md" }),
		() => progressStyles.track({ size: "sm" }),
	],
	[
		"slider track vertical",
		() => sliderStyles.track({ orientation: "vertical" }),
		() => sliderStyles.track({ orientation: "horizontal" }),
	],
	[
		"slider fill vertical",
		() => sliderStyles.fill({ orientation: "vertical" }),
		() => sliderStyles.fill({ orientation: "horizontal" }),
	],
])("%s returns its own class", (_, variant, fallback) => {
	expect(variant()).not.toBe(fallback());
	// The variant adds to the base class; it does not replace it.
	expect(variant().split(" ")).toEqual(
		expect.arrayContaining(fallback().split(" ").slice(0, 1)),
	);
});
