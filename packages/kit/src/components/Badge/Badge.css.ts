import { globalStyle, recipe, style } from "../../foundation/layer.css";
import { tokens } from "../../foundation/cui.css";

type ToneColors = { fill: string; text: string; outlineText: string; border: string };

const tones = {
	neutral: {
		fill: tokens.action.neutral.base,
		text: tokens.text.panelMuted,
		outlineText: tokens.text.panelMuted,
		border: tokens.action.neutral.active,
	},
	info: {
		fill: tokens.action.brandSoft.base,
		text: tokens.action.brandSoft.text,
		outlineText: tokens.action.brandSoft.text,
		border: tokens.action.brand.base,
	},
	success: {
		fill: tokens.action.success.base,
		text: tokens.action.success.text,
		outlineText: tokens.text.default,
		border: tokens.action.success.base,
	},
	warning: {
		fill: tokens.action.caution.base,
		text: tokens.action.caution.text,
		outlineText: tokens.text.default,
		border: tokens.action.caution.base,
	},
	danger: {
		fill: tokens.action.danger.base,
		text: tokens.action.danger.text,
		outlineText: tokens.text.danger,
		border: tokens.action.danger.base,
	},
} satisfies Record<string, ToneColors>;

type Tone = keyof typeof tones;
const toneNames = Object.keys(tones) as Tone[];

export const root = recipe({
	base: {
		display: "inline-flex",
		alignItems: "center",
		gap: tokens.space["1"],
		boxSizing: "border-box",
		borderRadius: tokens.radius.badge,
		border: `${tokens.border.width} solid transparent`,
		fontFamily: tokens.font.family.sans,
		fontWeight: tokens.font.weight.normal,
		lineHeight: tokens.font.lineHeight.compact,
		whiteSpace: "nowrap",
		verticalAlign: "middle",
	},
	variants: {
		size: {
			sm: {
				minHeight: tokens.space["4"],
				padding: `${tokens.space.px} ${tokens.space["1.5"]}`,
				fontSize: tokens.font.size.badge,
			},
			md: {
				minHeight: tokens.space["5"],
				padding: `${tokens.space["0.5"]} ${tokens.space["2"]}`,
				fontSize: tokens.font.size.xs,
			},
		},
		tone: Object.fromEntries(toneNames.map(tone => [tone, {}])) as Record<Tone, {}>,
		variant: {
			soft: {},
			outline: { backgroundColor: "transparent" },
		},
	},
	compoundVariants: toneNames.flatMap(tone => [
		{
			variants: { tone, variant: "soft" as const },
			style: { backgroundColor: tones[tone].fill, color: tones[tone].text },
		},
		{
			variants: { tone, variant: "outline" as const },
			style: { borderColor: tones[tone].border, color: tones[tone].outlineText },
		},
	]),
	defaultVariants: { size: "sm", tone: "neutral", variant: "soft" },
});

export const icon = style({
	display: "inline-flex",
	flexShrink: 0,
});

globalStyle(`${icon} > svg`, { width: "1em", height: "1em" });

export const label = style({
	minWidth: 0,
	overflow: "hidden",
	textOverflow: "ellipsis",
});
