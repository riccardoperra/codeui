import { style, recipe, globalStyle } from "../../foundation/layer.css";
import { tokens } from "../../foundation/cui.css";
import { transition } from "../../foundation/motion.css";
import { whileKeyboard } from "../../utils/modality";

const finePointer = "(hover: hover) and (pointer: fine)";
const reducedMotion = "(prefers-reduced-motion: reduce)";

export const root = style({
	display: "flex",
	flexDirection: "column",
	gap: tokens.space["1"],
	minWidth: 0,
	lineHeight: tokens.font.lineHeight.sm,
});
export const item = style({
	minWidth: 0,
	borderRadius: tokens.radius.card,
	color: tokens.text.default,
	selectors: { "&[data-expanded]": { background: tokens.surface.panel } },
});
export const header = style({
	margin: 0,
	fontSize: tokens.font.size.sm,
	fontWeight: tokens.font.weight.semibold,
	lineHeight: tokens.font.lineHeight.sm,
});
/** A 36px row: 8px before the icon, 12px after the chevron, 10px between. */
export const trigger = recipe({
	base: {
		display: "flex",
		alignItems: "center",
		gap: tokens.space["2.5"],
		width: "100%",
		minHeight: tokens.control.height.sm,
		padding: `0 ${tokens.space["3"]} 0 ${tokens.space["2"]}`,
		border: 0,
		borderRadius: tokens.radius.md,
		background: "transparent",
		color: "inherit",
		font: "inherit",
		textAlign: "left",
		cursor: "pointer",
		selectors: {
			"&:focus-visible": {
				outline: `${tokens.focus.width} solid ${tokens.focus.color}`,
				outlineOffset: tokens.focus.offset,
			},
			"&:disabled": { color: tokens.text.muted, cursor: "default" },
		},
		"@media": {
			"(pointer: coarse)": { minHeight: tokens.control.height.md },
			[finePointer]: {
				selectors: {
					// One fill step up from the island, so muted text keeps 4.5:1.
					"&:hover:not(:disabled):not([data-expanded])": {
						background: tokens.surface.input,
					},
				},
			},
		},
	},
	variants: {
		density: {
			compact: { paddingBlock: tokens.space["1"] },
			comfortable: { paddingBlock: tokens.space["3"] },
		},
	},
});
/*
 * The body transitions its measured height and its opacity, so a second click
 * retargets from wherever the first one got to (Inkstone §7.3 Expand).
 */
export const content = style({
	overflow: "hidden",
	minWidth: 0,
	height: 0,
	opacity: 0,
	fontSize: tokens.font.size.caption,
	lineHeight: tokens.font.lineHeight.caption,
	paddingInline: tokens.space["2"],
	transition: transition(["height", "opacity"], tokens.motion.duration.panel),
	selectors: {
		"&[data-open]": {
			height: "var(--cui-accordion-content-height, auto)",
			opacity: 1,
		},
		'[data-cui="accordion-root"][data-motion="none"] &': { transition: "none" },
		[`${whileKeyboard} &`]: { transition: "none" },
	},
	"@media": {
		[reducedMotion]: {
			transition: transition(["opacity"], tokens.motion.duration.panel),
		},
	},
});
globalStyle('[data-cui="accordion-content"][inert]', { pointerEvents: "none" });
globalStyle('[data-cui="accordion-content"][hidden]', { display: "none" });
export const icon = style({
	display: "inline-flex",
	flexShrink: 0,
	color: tokens.text.muted,
});
export const title = style({ flex: 1, minWidth: 0, overflowWrap: "anywhere" });
export const summary = style({
	marginLeft: "auto",
	maxWidth: "55%",
	fontSize: tokens.font.size.xs,
	fontWeight: tokens.font.weight.normal,
	lineHeight: tokens.font.lineHeight.xs,
	color: tokens.text.muted,
	overflow: "hidden",
	whiteSpace: "nowrap",
	textOverflow: "ellipsis",
});
/** CodeImage's "›", 20px, a quarter turn when the section opens. */
export const chevron = style({
	display: "inline-block",
	flexShrink: 0,
	width: tokens.space["4"],
	fontSize: tokens.font.size.xl,
	lineHeight: 1,
	textAlign: "center",
	color: tokens.text.muted,
	transition: transition(["transform"], tokens.motion.duration.panel),
	selectors: {
		'[data-expanded] > [data-cui="accordion-header"] > [data-cui="accordion-trigger"] &':
			{ transform: "rotate(90deg)" },
		'[data-cui="accordion-root"][data-motion="none"] &': { transition: "none" },
		[`${whileKeyboard} &`]: { transition: "none" },
	},
	"@media": { [reducedMotion]: { transition: "none" } },
});

globalStyle('[data-cui="accordion-item"][data-expanded] [data-cui="accordion-icon"]', {
	color: tokens.accent.focus,
});

export const contentBody = style({ paddingBottom: tokens.space["2"] });
