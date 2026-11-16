import { style } from "../../foundation/layer.css";
import { tokens as t } from "../../foundation/cui.css";
export const root = style({
	display: "grid",
	gap: t.space["2"],
	color: t.text.default,
	fontSize: t.font.size.caption,
});
export const label = style({ color: t.text.label });
export const description = style({ color: t.text.hint, fontSize: t.font.size.xs });
export const errorMessage = style({ color: t.text.danger, fontSize: t.font.size.xs });
export const valueLabel = style({
	color: t.text.hint,
	fontVariantNumeric: "tabular-nums",
});
export const input = style({});
export const track = style({
	position: "relative",
	height: t.control.height.compact,
	display: "flex",
	alignItems: "center",
	selectors: {
		"&[data-disabled]": { opacity: 0.4 },
		"&::before": {
			content: '""',
			position: "absolute",
			width: "100%",
			height: t.space["0.5"],
			background: t.surface.inputAccent,
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
});
export const fill = style({
	position: "absolute",
	height: t.space["0.5"],
	background: t.action.brand.base,
	borderRadius: t.radius.full,
	selectors: {
		"&[data-orientation=vertical]": { width: t.space["0.5"], height: "auto" },
	},
});
export const thumb = style({
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
			width: t.space["2.5"],
			height: t.space["2.5"],
			background: t.action.brand.text,
			borderRadius: t.radius.full,
		},
		"&:focus-visible": {
			outline: `${t.focus.width} solid ${t.focus.color}`,
			outlineOffset: t.focus.offset,
		},
		"&[data-invalid]::before": { outline: `${t.focus.width} solid ${t.text.danger}` },
		"&[data-disabled]": { cursor: "not-allowed" },
	},
	"@media": {
		"(pointer: coarse)": { width: t.control.height.md, height: t.control.height.md },
	},
});
