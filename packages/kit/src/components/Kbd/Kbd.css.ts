import { recipe } from "../../foundation/layer.css";
import { tokens } from "../../foundation/cui.css";

export const root = recipe({
	base: {
		display: "inline-flex",
		alignItems: "center",
		justifyContent: "center",
		boxSizing: "border-box",
		fontFamily: tokens.font.family.mono,
		fontWeight: tokens.font.weight.medium,
		lineHeight: tokens.font.lineHeight.compact,
		whiteSpace: "nowrap",
		borderRadius: tokens.radius.badge,
		backgroundColor: tokens.action.neutral.base,
		border: `${tokens.border.width} solid transparent`,
	},
	variants: {
		size: {
			sm: {
				minWidth: tokens.space["4"],
				minHeight: tokens.space["4"],
				paddingInline: tokens.space["1"],
				fontSize: tokens.font.size.badge,
			},
			md: {
				minWidth: tokens.space["5"],
				minHeight: tokens.space["5"],
				paddingInline: tokens.space["1.5"],
				fontSize: tokens.font.size.xs,
			},
		},
		variant: {
			keycap: {
				color: tokens.action.neutral.text,
				borderColor: tokens.border.divider,
			},
			hint: {
				color: tokens.text.hint,
			},
		},
	},
	defaultVariants: { size: "sm", variant: "keycap" },
});
