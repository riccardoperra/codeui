import { keyframes } from "@vanilla-extract/css";
import { tokens } from "../../foundation/cui.css";
import { recipe, style } from "../../foundation/layer.css";

const fadeIn = keyframes({ from: { opacity: 0 } });
const fadeOut = keyframes({ to: { opacity: 0 } });
const offscreen = {
	bottom: "translateY(100%)",
	left: "translateX(-100%)",
	right: "translateX(100%)",
} as const;

const duration = tokens.motion.duration.panel;
const ease = tokens.motion.ease.out;
const gutter = tokens.space["10"];
const radius = tokens.radius.xl;

/**
 * Pointer opens and closes slide. Keyboard and programmatic ones set
 * `data-motion=none` and do not animate. Reduced motion keeps a fade.
 */
function presence(enter: string, exit: string) {
	return {
		animation: `${exit} ${duration} ${ease} forwards`,
		selectors: {
			"&[data-expanded]": { animation: `${enter} ${duration} ${ease}` },
			"&[data-motion=none], &[data-motion=none][data-expanded]": { animation: "none" },
		},
		"@media": {
			"(prefers-reduced-motion: reduce)": {
				animationName: fadeOut,
				selectors: { "&[data-expanded]": { animationName: fadeIn } },
			},
		},
	};
}

const slide = (transform: string) =>
	presence(keyframes({ from: { transform } }), keyframes({ to: { transform } }));

const edge = {
	top: 0,
	bottom: 0,
	width: `min(24rem, calc(100vw - ${gutter}))`,
	paddingTop: "env(safe-area-inset-top)",
	paddingBottom: "env(safe-area-inset-bottom)",
};

export const overlay = style({
	position: "fixed",
	inset: 0,
	zIndex: 40,
	backgroundColor: tokens.surface.scrim,
	...presence(fadeIn, fadeOut),
});

export const content = recipe({
	base: {
		position: "fixed",
		zIndex: 40,
		boxSizing: "border-box",
		display: "flex",
		flexDirection: "column",
		overflow: "hidden",
		color: tokens.text.dialog,
		backgroundColor: tokens.surface.dialog,
		boxShadow: tokens.shadow.dialog,
		outline: "none",
	},
	variants: {
		side: {
			bottom: {
				left: 0,
				right: 0,
				bottom: 0,
				maxHeight: `calc(100dvh - ${gutter})`,
				borderRadius: `${radius} ${radius} 0 0`,
				paddingBottom: "env(safe-area-inset-bottom)",
				...slide(offscreen.bottom),
			},
			left: {
				...edge,
				left: 0,
				borderRadius: `0 ${radius} ${radius} 0`,
				paddingLeft: "env(safe-area-inset-left)",
				...slide(offscreen.left),
			},
			right: {
				...edge,
				right: 0,
				borderRadius: `${radius} 0 0 ${radius}`,
				paddingRight: "env(safe-area-inset-right)",
				...slide(offscreen.right),
			},
		},
	},
	defaultVariants: { side: "bottom" },
});

export const header = style({
	display: "flex",
	alignItems: "center",
	justifyContent: "space-between",
	gap: tokens.space["3"],
	flexShrink: 0,
	minHeight: tokens.control.height.xl,
	padding: `0 ${tokens.space["4"]} 0 ${tokens.space["6"]}`,
	borderBottom: `${tokens.border.width} solid ${tokens.border.dialogTitle}`,
});

export const title = style({
	margin: 0,
	color: tokens.text.dialogTitle,
	fontSize: tokens.font.size.lg,
	fontWeight: tokens.font.weight.medium,
	lineHeight: tokens.font.lineHeight.compact,
});

export const description = style({
	margin: 0,
	padding: `${tokens.space["4"]} ${tokens.space["6"]} 0`,
	color: tokens.text.dialog,
	fontSize: tokens.font.size.sm,
});

/** The close button keeps its size and gets a 40px hit area on touch screens. */
export const closeButton = style({
	position: "relative",
	flexShrink: 0,
	marginInlineStart: "auto",
	"@media": {
		"(pointer: coarse)": {
			selectors: {
				"&::after": {
					content: "",
					position: "absolute",
					inset: `calc((${tokens.control.height.xs} - ${tokens.control.height.md}) / 2)`,
				},
			},
		},
	},
});

export const handle = style({
	position: "relative",
	display: "flex",
	alignItems: "center",
	justifyContent: "center",
	flexShrink: 0,
	width: "100%",
	height: tokens.control.height.md,
	padding: 0,
	border: 0,
	background: "transparent",
	cursor: "grab",
	touchAction: "none",
	outline: "none",
	selectors: {
		"&::before": {
			content: "",
			width: tokens.space["10"],
			height: tokens.space["1"],
			borderRadius: tokens.radius.full,
			backgroundColor: tokens.action.neutral.active,
		},
		"&:active": { cursor: "grabbing" },
		"&:focus-visible::before": {
			outline: `${tokens.focus.width} solid ${tokens.focus.color}`,
			outlineOffset: tokens.focus.offset,
		},
	},
	"@media": {
		"(hover: hover) and (pointer: fine)": {
			selectors: { "&:hover::before": { backgroundColor: tokens.text.muted } },
		},
	},
});

export const body = style({
	flex: 1,
	minHeight: 0,
	padding: tokens.space["6"],
	overflow: "auto",
	overscrollBehavior: "contain",
});

export const footer = style({
	display: "flex",
	justifyContent: "flex-end",
	gap: tokens.space["2"],
	flexShrink: 0,
	padding: `${tokens.space["4"]} ${tokens.space["6"]}`,
	borderTop: `${tokens.border.width} solid ${tokens.border.dialogTitle}`,
});
