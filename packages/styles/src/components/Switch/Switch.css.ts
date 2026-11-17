import { partSelector } from "../../foundation/public.css";
import { finish } from "../../foundation/public.css";
import { publicStylesRegistry as registry } from "../../registry";
import { createVar, fallbackVar, type StyleRule } from "@vanilla-extract/css";
import { globalStyle, publicRecipe as recipe, style } from "../../foundation/public.css";
import { tokens as t } from "../../foundation/cui.css";
import { transition } from "../../foundation/motion.css";
import { inputModalityAttribute, whileKeyboard } from "../../utils/modality";

const rootSelector = partSelector(registry.switch.parts.root);
const inputSelector = partSelector(registry.switch.parts.input);
const coarse = "(pointer: coarse)";
const reducedMotion = "(prefers-reduced-motion: reduce)";
const trackWidthVar = createVar("trackWidth");
const trackHeightVar = createVar("trackHeight");
const thumbSizeVar = createVar("thumbSize");
const notCoarse = "(pointer: fine), (pointer: none)";
const dimensions = {
	sm: { width: t.control.height.compact, height: t.space["4"], thumb: t.space["3"] },
	md: {
		width: t.control.height.sm,
		height: `calc(${t.space["5"]} + ${t.space["0.5"]})`,
		thumb: t.space["4"],
	},
};
const small = {
	[trackWidthVar]: dimensions.sm.width,
	[trackHeightVar]: dimensions.sm.height,
	[thumbSizeVar]: dimensions.sm.thumb,
};
const medium = {
	[trackWidthVar]: dimensions.md.width,
	[trackHeightVar]: dimensions.md.height,
	[thumbSizeVar]: dimensions.md.thumb,
};
const sizeVariables = { sm: small, md: medium };
const variables = (size: keyof typeof dimensions) => sizeVariables[size];
const defaults = dimensions[registry.switch.defaults.size];
const trackWidth = fallbackVar(trackWidthVar, defaults.width);
const trackHeight = fallbackVar(trackHeightVar, defaults.height);
const thumbSize = fallbackVar(thumbSizeVar, defaults.thumb);
// Keep md's existing recipe metadata type while sharing the authored rule.
const mediumVariant: {} = {
	"@media": { [notCoarse]: { vars: medium } },
} satisfies StyleRule;

export const root = style(
	{
		vars: variables(registry.switch.defaults.size),
		display: "inline-grid",
		gridTemplateColumns: "auto 1fr",
		alignItems: "center",
		columnGap: t.space["2"],
		minHeight: t.control.height.compact,
		position: "relative",
		color: t.text.default,
		fontSize: t.font.size.caption,
		lineHeight: t.font.lineHeight.caption,
		selectors: { "&:is([data-disabled], :disabled)": { opacity: 0.4 } },
		"@media": { [coarse]: { minHeight: t.control.height.md } },
	},
	"root",
	registry.switch.parts.root,
);
export const input = style({}, "input", registry.switch.parts.input);
/**
 * Track 36×22 with a 16px thumb (CodeImage), 28×16 with a 12px thumb at `sm`,
 * 44×26 with a 20px thumb on touch screens (Inkstone §6).
 */
export const control = recipe(
	{
		base: {
			position: "relative",
			display: "inline-flex",
			alignItems: "center",
			flexShrink: 0,
			boxSizing: "border-box",
			width: trackWidth,
			height: trackHeight,
			padding: `calc((${trackHeight} - ${thumbSize}) / 2)`,
			borderRadius: t.radius.full,
			background: t.surface.track,
			cursor: "pointer",
			transition: `background-color ${t.motion.duration.fast} ease`,
			selectors: {
				"&::before": {
					content: '""',
					position: "absolute",
					inset: `calc((${trackHeight} - ${t.control.height.compact}) / 2) 0`,
				},
				"&[data-checked]": { background: t.action.brand.base },
				"&[data-invalid]": { outline: `${t.focus.width} solid ${t.text.danger}` },
				// Kobalte focuses the input from script after a click, which the
				// browser marks focus-visible. The ring is for the keyboard only.
				[`:root:not([${inputModalityAttribute}="pointer"]) ${rootSelector} ${inputSelector}:focus-visible ~ &`]:
					{
						outline: `${t.focus.width} solid ${t.focus.color}`,
						outlineOffset: t.focus.offset,
					},
				"&:is([data-disabled], :disabled)": { cursor: "not-allowed" },
				[`${whileKeyboard} &`]: { transition: "none" },
			},
			"@media": {
				[coarse]: {
					vars: {
						[trackWidthVar]: `calc(${t.space["10"]} + ${t.space["1"]})`,
						[trackHeightVar]: `calc(${t.space["6"]} + ${t.space["0.5"]})`,
						[thumbSizeVar]: t.space["5"],
					},
					selectors: {
						"&::before": {
							inset: `calc((${trackHeight} - ${t.control.height.md}) / 2) 0`,
						},
					},
				},
			},
		},
		variants: {
			size: {
				sm: { "@media": { [notCoarse]: { vars: small } } },
				md: mediumVariant,
			},
		},
	},
	"control",
	registry.switch.parts.control,
);
export const smallRoot = style({}, "smallRoot");
export const mediumRoot = style({}, "mediumRoot");
const rootSizeClasses = { sm: smallRoot, md: mediumRoot };
for (const size of registry.switch.variants.size)
	globalStyle(
		`:is(${rootSelector}[data-size="${size}"],${rootSelector}.${rootSizeClasses[size]}:not([data-size]))`,
		{ "@media": { [notCoarse]: { vars: variables(size) } } },
	);
export const thumb = recipe(
	{
		base: {
			flexShrink: 0,
			width: thumbSize,
			height: thumbSize,
			borderRadius: t.radius.full,
			background: t.action.brand.text,
			boxShadow: t.shadow.thumb,
			transition: transition(["transform"], t.motion.duration.fast),
			selectors: {
				"&[data-checked]": {
					transform: `translateX(calc(${trackWidth} - ${trackHeight}))`,
				},
				[`${whileKeyboard} &`]: { transition: "none" },
			},
			"@media": { [reducedMotion]: { transition: "none" } },
		},
		variants: { size: { sm: {}, md: {} } },
	},
	"thumb",
	registry.switch.parts.thumb,
);
export const label = style(
	{
		color: t.text.label,
		lineHeight: t.font.lineHeight.caption,
		cursor: "pointer",
	},
	"label",
	registry.switch.parts.label,
);
export const description = style(
	{
		gridColumn: "2",
		color: t.text.hint,
		fontSize: t.font.size.xs,
		lineHeight: t.font.lineHeight.xs,
	},
	"description",
	registry.switch.parts.description,
);
export const errorMessage = style(
	{
		gridColumn: "2",
		color: t.text.danger,
		fontSize: t.font.size.xs,
		lineHeight: t.font.lineHeight.xs,
	},
	"errorMessage",
	registry.switch.parts.errorMessage,
);

finish();
