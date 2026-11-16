import { recipe, style } from "../../foundation/layer.css";
import { tokens as t } from "../../foundation/cui.css";
import { transition } from "../../foundation/motion.css";

const coarse = "(pointer: coarse)";

export const root = style({
	display: "flex",
	flexDirection: "column",
	gap: t.space["2"],
	minWidth: 0,
	color: t.text.default,
	fontSize: t.font.size.caption,
});
export const label = style({ color: t.text.label, fontWeight: t.font.weight.medium });
export const description = style({ color: t.text.hint, fontSize: t.font.size.xs });
export const errorMessage = style({ color: t.text.danger, fontSize: t.font.size.xs });

export const control = recipe({
	base: {
		display: "flex",
		alignItems: "center",
		gap: t.space["1"],
		width: "100%",
		minWidth: 0,
		height: t.control.height.sm,
		paddingInline: `${t.space["3"]} ${t.space["1"]}`,
		background: t.surface.input,
		color: t.text.input,
		border: `${t.border.width} solid ${t.border.input}`,
		borderRadius: t.radius.sm,
		fontSize: t.font.size.sm,
		transition: transition(["border-color"]),
		selectors: {
			"&:focus-within": {
				outline: `${t.focus.width} solid ${t.focus.color}`,
				outlineOffset: t.focus.offset,
			},
			"&[data-invalid]": { borderColor: t.text.danger },
			"&[data-disabled]": { opacity: 0.4, cursor: "not-allowed" },
		},
		"@media": { [coarse]: { height: t.control.height.md } },
	},
	variants: {
		size: {
			sm: { height: t.control.height.compact, fontSize: t.font.size.caption },
			md: {},
		},
	},
});

export const input = style({
	appearance: "none",
	flex: 1,
	minWidth: 0,
	height: "100%",
	padding: 0,
	border: 0,
	outline: "none",
	background: "transparent",
	color: "inherit",
	font: "inherit",
	selectors: {
		"&::placeholder": { color: t.text.hint, opacity: 1 },
		"&:disabled": { cursor: "not-allowed" },
	},
});

export const trigger = style({
	display: "inline-flex",
	alignItems: "center",
	justifyContent: "center",
	flexShrink: 0,
	width: t.control.height.compact,
	height: t.control.height.compact,
	padding: 0,
	border: 0,
	borderRadius: t.radius.xs,
	background: "transparent",
	color: t.text.hint,
	cursor: "pointer",
	selectors: { "&:disabled": { cursor: "not-allowed" } },
	"@media": {
		[coarse]: { width: t.control.height.md, height: t.control.height.md },
	},
});

export const icon = style({
	display: "inline-flex",
	width: t.space["4"],
	height: t.space["4"],
});

export const content = style({
	zIndex: 50,
	display: "flex",
	flexDirection: "column",
	minWidth: "var(--kb-popper-anchor-width)",
	maxHeight: "min(400px, var(--kb-popper-content-available-height, 400px))",
	padding: t.space["1"],
	overflow: "auto",
	background: t.surface.menu,
	color: t.text.menu,
	border: `${t.border.width} solid ${t.border.menu}`,
	borderRadius: t.radius.md,
	boxShadow: t.shadow.menu,
	outline: "none",
	transformOrigin: "var(--kb-combobox-content-transform-origin)",
});

export const arrow = style({ fill: t.surface.menu });

export const listbox = style({
	display: "flex",
	flexDirection: "column",
	gap: t.space["0.5"],
	margin: 0,
	padding: 0,
	listStyle: "none",
	outline: "none",
});

export const empty = style({
	padding: `${t.space["1.5"]} ${t.space["2"]}`,
	color: t.text.hint,
	fontSize: t.font.size.caption,
});

export const item = style({
	display: "flex",
	alignItems: "center",
	gap: t.space["2"],
	minHeight: t.control.height.compact,
	padding: `${t.space["1"]} ${t.space["2"]}`,
	borderRadius: t.radius.sm,
	color: t.text.menu,
	fontSize: t.font.size.sm,
	cursor: "default",
	userSelect: "none",
	outline: "none",
	selectors: {
		"&[data-highlighted]": { background: t.accent.selection, color: t.text.selected },
		"&[data-disabled]": { opacity: 0.4, cursor: "not-allowed" },
	},
	"@media": { [coarse]: { minHeight: t.control.height.md } },
});

export const itemLabel = style({
	display: "flex",
	alignItems: "center",
	gap: t.space["2"],
	flex: 1,
	minWidth: 0,
	overflow: "hidden",
	textOverflow: "ellipsis",
	whiteSpace: "nowrap",
});

export const itemDescription = style({
	color: t.text.hint,
	fontSize: t.font.size.xs,
	selectors: { [`${item}[data-highlighted] &`]: { color: "inherit" } },
});

export const itemIndicator = style({
	display: "inline-flex",
	flexShrink: 0,
	width: t.space["4"],
	height: t.space["4"],
	marginLeft: "auto",
});

export const section = style({
	padding: `${t.space["1.5"]} ${t.space["2"]} ${t.space["1"]}`,
	color: t.text.hint,
	fontSize: t.font.size.xs,
	fontWeight: t.font.weight.semibold,
});

export const hiddenSelect = style({});
