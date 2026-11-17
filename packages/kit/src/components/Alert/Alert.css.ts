import { globalStyle, recipe, style } from "../../foundation/layer.css";
import { tokens } from "../../foundation/cui.css";

const tones = {
	neutral: { background: tokens.action.neutral.base, color: tokens.action.neutral.text },
	info: { background: tokens.action.brandSoft.base, color: tokens.action.brandSoft.text },
	success: { background: tokens.action.success.base, color: tokens.action.success.text },
	warning: { background: tokens.action.caution.base, color: tokens.action.caution.text },
	danger: { background: tokens.action.danger.base, color: tokens.action.danger.text },
} as const;

/**
 * Icon, text and action sit in their own grid columns. Spacing comes from
 * margins rather than `gap`, so an absent icon or action leaves no gap.
 */
export const root = recipe({
	base: {
		display: "inline-grid",
		gridTemplateColumns: "auto minmax(0, 1fr) auto",
		alignItems: "start",
		boxSizing: "border-box",
		maxWidth: "100%",
		padding: tokens.space["3"],
		borderRadius: tokens.radius.sm,
		fontFamily: tokens.font.family.sans,
		fontSize: tokens.font.size.caption,
		lineHeight: tokens.font.lineHeight.normal,
	},
	variants: {
		tone: tones,
		fluid: {
			true: { display: "grid", width: "100%" },
			false: {},
		},
	},
	defaultVariants: { tone: "neutral", fluid: false },
});

export const icon = style({
	gridColumn: 1,
	gridRow: "1 / span 2",
	display: "inline-flex",
	height: `calc(${tokens.font.size.caption} * ${tokens.font.lineHeight.normal})`,
	alignItems: "center",
	marginInlineEnd: tokens.space["2"],
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

export const action = style({
	gridColumn: 3,
	gridRow: "1 / span 2",
	alignSelf: "center",
	display: "flex",
	gap: tokens.space["2"],
	marginInlineStart: tokens.space["2"],
});
