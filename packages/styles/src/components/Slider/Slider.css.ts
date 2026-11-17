import { recipe, style } from "../../foundation/layer.css";
import { tokens as t } from "../../foundation/cui.css";
export const root = style(
	{
		display: "grid",
		gap: t.space["2"],
		color: t.text.default,
		fontSize: t.font.size.caption,
		lineHeight: t.font.lineHeight.caption,
	},
	"root",
);
export const label = style(
	{ color: t.text.label, lineHeight: t.font.lineHeight.caption },
	"label",
);
export const description = style(
	{
		color: t.text.hint,
		fontSize: t.font.size.xs,
		lineHeight: t.font.lineHeight.xs,
	},
	"description",
);
export const errorMessage = style(
	{
		color: t.text.danger,
		fontSize: t.font.size.xs,
		lineHeight: t.font.lineHeight.xs,
	},
	"errorMessage",
);
export const valueLabel = style(
	{
		color: t.text.hint,
		fontVariantNumeric: "tabular-nums",
	},
	"valueLabel",
);
export const input = style({}, "input");
const verticalTrack = {
	height: t.space["32"],
	width: t.control.height.compact,
	selectors: { "&::before": { height: "100%", width: t.space["0.5"] } },
};
const verticalFill = { width: t.space["0.5"], height: "auto" };
export const track = recipe(
	{
		base: {
			position: "relative",
			height: t.control.height.compact,
			display: "flex",
			alignItems: "center",
			justifyContent: "center",
			selectors: {
				"&:is([data-disabled], :disabled)": { opacity: 0.4 },
				"&::before": {
					content: '""',
					position: "absolute",
					width: "100%",
					height: t.space["0.5"],
					background: t.border.divider,
					borderRadius: t.radius.full,
				},
				"&[data-orientation=vertical]": {
					height: t.space["32"],
					width: t.control.height.compact,
				},
				"&[data-orientation=vertical]::before": { height: "100%", width: t.space["0.5"] },
			},
			"@media": {
				"(pointer: coarse)": {
					minHeight: t.control.height.md,
					minWidth: t.control.height.md,
				},
			},
		},
		variants: { orientation: { horizontal: {}, vertical: verticalTrack } },
	},
	"track",
);
export const fill = recipe(
	{
		base: {
			position: "absolute",
			height: t.space["0.5"],
			background: t.action.brand.base,
			borderRadius: t.radius.full,
			selectors: { "&[data-orientation=vertical]": verticalFill },
		},
		variants: { orientation: { horizontal: {}, vertical: verticalFill } },
	},
	"fill",
);
export const thumb = style(
	{
		display: "flex",
		alignItems: "center",
		justifyContent: "center",
		width: t.control.height.compact,
		height: t.control.height.compact,
		borderRadius: t.radius.full,
		cursor: "pointer",
		selectors: {
			"&::before": {
				content: '""',
				boxSizing: "border-box",
				width: t.space["3"],
				height: t.space["3"],
				background: t.action.brand.text,
				border: `${t.border.width} solid ${t.border.divider}`,
				borderRadius: t.radius.full,
				boxShadow: t.shadow.lg,
			},
			"&:focus-visible": {
				outline: `${t.focus.width} solid ${t.focus.color}`,
				outlineOffset: t.focus.offset,
			},
			"&[data-invalid]::before": { outline: `${t.focus.width} solid ${t.text.danger}` },
			"&:is([data-disabled], :disabled)": { cursor: "not-allowed" },
		},
		"@media": {
			"(pointer: coarse)": { width: t.control.height.md, height: t.control.height.md },
		},
	},
	"thumb",
);
