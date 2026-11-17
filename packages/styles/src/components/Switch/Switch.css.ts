import { finish } from "../../foundation/public.css";
import { publicStylesRegistry as registry } from "../../registry";
import { createVar } from "@vanilla-extract/css";
import { globalStyle, publicRecipe as recipe, style } from "../../foundation/public.css";
import { tokens as t } from "../../foundation/cui.css";
import { transition } from "../../foundation/motion.css";
import { inputModalityAttribute, whileKeyboard } from "../../utils/modality";

const coarse = "(pointer: coarse)";
const reducedMotion = "(prefers-reduced-motion: reduce)";
const trackWidth = createVar("trackWidth");
const trackHeight = createVar("trackHeight");
const thumbSize = createVar("thumbSize");
const notCoarse = "(pointer: fine), (pointer: none)";
const small = {
	[trackWidth]: t.control.height.compact,
	[trackHeight]: t.space["4"],
	[thumbSize]: t.space["3"],
};

export const root = style(
	{
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
			vars: {
				[trackWidth]: t.control.height.sm,
				[trackHeight]: `calc(${t.space["5"]} + ${t.space["0.5"]})`,
				[thumbSize]: t.space["4"],
			},
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
				[`:root:not([${inputModalityAttribute}="pointer"]) [data-cui="switch-input"]:focus-visible ~ &`]:
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
						[trackWidth]: `calc(${t.space["10"]} + ${t.space["1"]})`,
						[trackHeight]: `calc(${t.space["6"]} + ${t.space["0.5"]})`,
						[thumbSize]: t.space["5"],
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
				md: {},
			},
		},
	},
	"control",
	registry.switch.parts.control,
);
// A Root with `size="sm"` sizes the parts inside it as well.
globalStyle(`.cui-switch-root[data-size="sm"] .cui-switch-control:not([data-size])`, {
	"@media": { [notCoarse]: { vars: small } },
});
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
