import { style, globalStyle } from "../../foundation/layer.css";
import { tokens as t } from "../../foundation/cui.css";

export const root = style({
	display: "grid",
	gridTemplateColumns: `repeat(auto-fit, minmax(min(100%, ${t.space["32"]}), 1fr))`,
	gap: t.space["2"],
	fontFamily: t.font.family.sans,
	color: t.text.default,
});
export const label = style({ gridColumn: "1 / -1", fontSize: t.font.size.sm });
export const description = style({
	gridColumn: "1 / -1",
	fontSize: t.font.size.xs,
	color: t.text.muted,
});
export const errorMessage = style({
	gridColumn: "1 / -1",
	fontSize: t.font.size.xs,
	color: t.text.danger,
});
export const item = style({ position: "relative", minWidth: 0, display: "flex" });
export const itemInput = style({});
export const itemControl = style({});
export const itemIndicator = style({});
export const itemLabel = style({
	display: "flex",
	flexDirection: "column",
	alignItems: "flex-start",
	gap: t.space["2"],
	width: "100%",
	minWidth: 0,
	boxSizing: "border-box",
	minHeight: t.space["8"],
	padding: t.space["3"],
	borderRadius: t.radius.md,
	border: `${t.focus.width} solid transparent`,
	background: t.surface.input,
	color: t.text.default,
	fontSize: t.font.size.sm,
	cursor: "pointer",
	overflowWrap: "anywhere",
	selectors: {
		"&[data-checked]": { borderColor: t.action.brand.base },
		"&[data-disabled]": { cursor: "not-allowed", color: t.text.hint },
	},
	"@media": {
		"(pointer: coarse)": { minHeight: t.space["10"] },
		"(hover: hover)": {
			selectors: {
				"&:hover:not([data-disabled])": { background: t.surface.inputAccent },
			},
		},
	},
});
globalStyle(`${item}:has(input:focus-visible) ${itemLabel}`, {
	outline: `${t.focus.width} solid ${t.focus.color}`,
	outlineOffset: t.focus.offset,
});
globalStyle(`${itemLabel}[data-variant=tile]`, { padding: t.space["2"] });
globalStyle(`${root}[data-orientation=vertical]`, { gridTemplateColumns: "1fr" });
export const itemDescription = style({ fontSize: t.font.size.xs, color: t.text.muted });
export const preview = style({
	display: "grid",
	placeItems: "center",
	alignSelf: "stretch",
	minHeight: t.space["16"],
	pointerEvents: "none",
});
export const badge = style({});
globalStyle(`${item}[data-invalid] ${itemLabel}`, { borderColor: t.action.danger.base });
