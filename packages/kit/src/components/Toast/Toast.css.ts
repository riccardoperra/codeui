import { createVar, keyframes } from "@vanilla-extract/css";
import { globalStyle, recipe, style } from "../../foundation/layer.css";
import { tokens } from "../../foundation/cui.css";
import { transition } from "../../foundation/motion.css";

const accent = createVar();

const coarsePointer = "(pointer: coarse)";
const reducedMotion = "(prefers-reduced-motion: reduce)";

export const region = recipe({
	base: {
		position: "fixed",
		zIndex: 50,
		boxSizing: "border-box",
		width: `min(100%, calc(480px + 2 * ${tokens.space["4"]}))`,
		padding: tokens.space["4"],
		outline: "none",
		pointerEvents: "none",
	},
	variants: {
		position: {
			"top-left": { top: 0, left: 0 },
			"top-center": { top: 0, left: "50%", transform: "translateX(-50%)" },
			"top-right": { top: 0, right: 0 },
			"bottom-left": { bottom: 0, left: 0 },
			"bottom-center": { bottom: 0, left: "50%", transform: "translateX(-50%)" },
			"bottom-right": { bottom: 0, right: 0 },
		},
	},
	defaultVariants: { position: "bottom-center" },
});

export const list = style({
	display: "flex",
	flexDirection: "column",
	alignItems: "center",
	gap: tokens.space["2"],
	margin: 0,
	padding: 0,
	listStyle: "none",
	outline: "none",
	selectors: {
		[`[data-position$=left] &`]: { alignItems: "flex-start" },
		[`[data-position$=right] &`]: { alignItems: "flex-end" },
	},
});

const rise = keyframes({ from: { opacity: 0, transform: "translateY(8px)" } });
const drop = keyframes({ from: { opacity: 0, transform: "translateY(-8px)" } });
const fadeIn = keyframes({ from: { opacity: 0 } });
const fadeOut = keyframes({ to: { opacity: 0 } });
const swipeOut = keyframes({
	from: { transform: "translateX(var(--kb-toast-swipe-end-x))" },
	to: { transform: "translateX(var(--kb-toast-swipe-end-x))", opacity: 0 },
});

const enter = `${tokens.motion.duration.panel} ${tokens.motion.ease.out}`;
const exit = `${tokens.motion.duration.normal} ${tokens.motion.ease.out} forwards`;

/**
 * Icon, text, action and close button sit in their own grid columns. Margins
 * space them instead of `gap`, so absent parts leave no gap.
 */
export const root = recipe({
	base: {
		display: "grid",
		gridTemplateColumns: "auto minmax(0, 1fr) auto auto",
		alignItems: "center",
		boxSizing: "border-box",
		maxWidth: "100%",
		padding: tokens.space["3"],
		borderRadius: tokens.radius.md,
		backgroundColor: tokens.surface.toast,
		color: tokens.text.toast,
		boxShadow: tokens.shadow.menu,
		fontFamily: tokens.font.family.sans,
		fontSize: tokens.font.size.caption,
		lineHeight: tokens.font.lineHeight.normal,
		pointerEvents: "auto",
		selectors: {
			"&:focus-visible": {
				outline: `${tokens.focus.width} solid ${tokens.focus.color}`,
				outlineOffset: tokens.focus.offset,
			},
			"&[data-opened]": { animation: `${rise} ${enter}` },
			"[data-position^=top] &[data-opened]": { animationName: drop },
			"&[data-closed]": { animation: `${fadeOut} ${exit}` },
			"&[data-swipe=move]": { transform: "translateX(var(--kb-toast-swipe-move-x))" },
			"&[data-swipe=cancel]": {
				transform: "translateX(0)",
				transition: transition(["transform"], tokens.motion.duration.panel),
			},
			"&[data-swipe=end]": { animation: `${swipeOut} ${exit}` },
		},
		"@media": {
			[reducedMotion]: {
				selectors: {
					"&[data-opened], [data-position^=top] &[data-opened]": {
						animationName: fadeIn,
					},
					"&[data-swipe=end]": { animationName: fadeOut },
				},
			},
		},
	},
	variants: {
		tone: {
			neutral: { vars: { [accent]: tokens.text.toast } },
			info: { vars: { [accent]: tokens.action.brand.base } },
			success: { vars: { [accent]: tokens.action.success.base } },
			warning: { vars: { [accent]: tokens.action.caution.base } },
			danger: { vars: { [accent]: tokens.action.danger.base } },
		},
	},
	defaultVariants: { tone: "neutral" },
});

export const icon = style({
	gridColumn: 1,
	gridRow: "1 / span 2",
	display: "inline-flex",
	marginInlineEnd: tokens.space["2"],
	color: accent,
});

globalStyle(`${icon} > svg`, { width: tokens.font.size.md, height: tokens.font.size.md });

export const title = style({
	gridColumn: 2,
	fontWeight: tokens.font.weight.semibold,
});

export const description = style({
	gridColumn: 2,
	minWidth: 0,
	selectors: {
		// Without a title, take both rows so the text centers beside the icon and buttons.
		[`:not(:has(> ${title})) > &`]: { gridRow: "1 / span 2", alignSelf: "center" },
	},
});

const buttonBase = {
	gridRow: "1 / span 2",
	boxSizing: "border-box",
	minHeight: tokens.control.height.compact,
	marginInlineStart: tokens.space["2"],
	border: 0,
	borderRadius: tokens.radius.xs,
	backgroundColor: "transparent",
	fontFamily: "inherit",
	fontSize: "inherit",
	cursor: "pointer",
	transition: transition(["background-color"], tokens.motion.duration.normal),
	selectors: {
		"&:focus-visible": {
			outline: `${tokens.focus.width} solid ${tokens.focus.color}`,
			outlineOffset: 0,
		},
	},
	"@media": {
		"(hover: hover)": {
			selectors: { "&:hover": { backgroundColor: tokens.action.neutral.base } },
		},
		[coarsePointer]: { minHeight: tokens.control.height.md },
	},
} as const;

export const action = style({
	...buttonBase,
	gridColumn: 3,
	padding: `0 ${tokens.space["2"]}`,
	color: tokens.action.brandSoft.text,
	fontWeight: tokens.font.weight.semibold,
	whiteSpace: "nowrap",
});

export const closeButton = style({
	...buttonBase,
	gridColumn: 4,
	display: "inline-flex",
	alignItems: "center",
	justifyContent: "center",
	minWidth: tokens.control.height.compact,
	padding: 0,
	color: tokens.text.muted,
	"@media": {
		...buttonBase["@media"],
		[coarsePointer]: {
			minHeight: tokens.control.height.md,
			minWidth: tokens.control.height.md,
		},
	},
});

globalStyle(`${closeButton} > svg`, {
	width: tokens.font.size.md,
	height: tokens.font.size.md,
});

export const progressTrack = style({
	gridColumn: "1 / -1",
	gridRow: 3,
	height: tokens.space["0.5"],
	marginTop: tokens.space["2"],
	borderRadius: tokens.radius.full,
	backgroundColor: tokens.action.neutral.base,
	overflow: "hidden",
});

export const progressFill = style({
	height: "100%",
	width: "var(--kb-toast-progress-fill-width)",
	backgroundColor: accent,
});
