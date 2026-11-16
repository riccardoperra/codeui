import { style } from "../../foundation/layer.css";
import { tokens as t } from "../../foundation/cui.css";
export const root = style({
	display: "inline-grid",
	gridTemplateColumns: "auto 1fr",
	alignItems: "center",
	columnGap: t.space["2"],
	minHeight: t.control.height.compact,
	position: "relative",
	color: t.text.default,
	fontSize: t.font.size.caption,
	selectors: { "&[data-disabled]": { opacity: 0.4 } },
	"@media": { "(pointer: coarse)": { minHeight: t.control.height.md } },
});
export const input = style({});
export const control = style({
	position: "relative",
	display: "inline-flex",
	alignItems: "center",
	boxSizing: "border-box",
	width: t.control.height.sm,
	height: `calc(${t.space["5"]} + ${t.space["0.5"]})`,
	padding: t.space["0.5"],
	borderRadius: t.radius.full,
	background: t.action.neutral.active,
	cursor: "pointer",
	selectors: {
		"&::before": {
			content: '""',
			position: "absolute",
			inset: `calc(( ${t.space["5"]} - ${t.control.height.compact}) / 2) 0`,
		},
		"&[data-checked]": { background: t.action.brand.base },
		"&[data-invalid]": { outline: `${t.focus.width} solid ${t.text.danger}` },
		"&[data-focus-visible]": {
			outline: `${t.focus.width} solid ${t.focus.color}`,
			outlineOffset: t.focus.offset,
		},
		"&[data-disabled]": { cursor: "not-allowed" },
		'[data-size="sm"] &': {
			width: t.control.height.xs,
			height: `calc(${t.space["4"]} + ${t.space["0.5"]})`,
		},
	},
	"@media": {
		"(pointer: coarse)": {
			selectors: {
				"&::before": { inset: `calc(( ${t.space["5"]} - ${t.control.height.md}) / 2) 0` },
			},
		},
	},
});
export const thumb = style({
	transition: `transform ${t.motion.duration.normal} ${t.motion.ease.out}`,
	"@media": { "(prefers-reduced-motion: reduce)": { transition: "none" } },
	width: `calc(${t.space["4"]} + ${t.space["0.5"]})`,
	height: "100%",
	borderRadius: t.radius.full,
	background: t.action.brand.text,
	selectors: {
		"[data-focus-visible] &": { transition: "none" },
		"&[data-checked]": {
			transform: `translateX(calc(${t.space["3"]} + ${t.space["0.5"]}))`,
		},
		'[data-size="sm"] &': { width: `calc(${t.space["3"]} + ${t.space["0.5"]})` },
		'[data-size="sm"] &[data-checked]': { transform: `translateX(${t.space["3"]})` },
	},
});
export const label = style({ color: t.text.label, cursor: "pointer" });
export const description = style({
	gridColumn: "2",
	color: t.text.hint,
	fontSize: t.font.size.xs,
});
export const errorMessage = style({
	gridColumn: "2",
	color: t.text.danger,
	fontSize: t.font.size.xs,
});
