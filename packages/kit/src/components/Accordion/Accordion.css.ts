import { keyframes } from "@vanilla-extract/css";
import { style, recipe, globalStyle } from "../../foundation/layer.css";
import { tokens } from "../../foundation/cui.css";
import { presenceAnimation } from "../../foundation/motion.css";
const expand = keyframes({
	from: { height: 0, opacity: 0 },
	to: { height: "var(--kb-accordion-content-height)", opacity: 1 },
});
const collapse = keyframes({
	from: { height: "var(--kb-accordion-content-height)", opacity: 1 },
	to: { height: 0, opacity: 0 },
});
export const root = style({
	display: "flex",
	flexDirection: "column",
	gap: tokens.space["3"],
	minWidth: 0,
});
export const item = style({
	minWidth: 0,
	borderRadius: tokens.radius.card,
	color: tokens.text.default,
	selectors: { "&[data-expanded]": { background: tokens.surface.panel } },
});
export const header = style({
	margin: 0,
	fontSize: tokens.font.size.caption,
	fontWeight: tokens.font.weight.semibold,
});
export const trigger = recipe({
	base: {
		display: "flex",
		alignItems: "center",
		gap: tokens.space["3"],
		width: "100%",
		minHeight: tokens.control.height.compact,
		padding: tokens.space["3"],
		border: 0,
		borderRadius: tokens.radius.card,
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
			"(hover: hover)": {
				selectors: { "&:hover:not(:disabled)": { background: tokens.surface.menuHover } },
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
export const content = style([
	{
		overflow: "hidden",
		minWidth: 0,
		height: 0,
		selectors: { "&[data-expanded]": { height: "auto" } },
		fontSize: tokens.font.size.caption,
		paddingInline: tokens.space["3"],
	},
	presenceAnimation({
		enter: expand,
		exit: collapse,
		enterDuration: tokens.motion.duration.panel,
		fillMode: "forwards",
	}),
]);
globalStyle(
	'[data-cui="accordion-root"][data-motion="none"] [data-cui="accordion-content"]',
	{ animation: "none" },
);
globalStyle('[data-cui="accordion-content"][inert]', { pointerEvents: "none" });
globalStyle('[data-cui="accordion-content"][hidden]', { display: "none" });
export const icon = style({ display: "inline-flex", flexShrink: 0 });
export const title = style({ minWidth: 0, overflowWrap: "anywhere" });
export const summary = style({
	marginLeft: "auto",
	fontSize: tokens.font.size.xs,
	fontWeight: tokens.font.weight.normal,
	color: tokens.text.muted,
	overflowWrap: "anywhere",
});
export const chevron = style({
	flexShrink: 0,
	selectors: {
		'[data-expanded] > [data-cui="accordion-header"] > [data-cui="accordion-trigger"] &':
			{ transform: "rotate(180deg)" },
	},
});

globalStyle('[data-cui="accordion-content"]', {
	animationDuration: tokens.motion.duration.panel,
});
globalStyle('[data-cui="accordion-item"][data-expanded] [data-cui="accordion-icon"]', {
	color: tokens.action.brand.base,
});
