import { keyframes } from "@vanilla-extract/css";
import { recipe, style } from "../../foundation/layer.css";
import { tokens as t } from "../../foundation/cui.css";
const pulse = keyframes({ from: { opacity: 0.45 }, to: { opacity: 1 } }, "pulse");
export const root = style(
	{
		display: "grid",
		gap: t.space["2"],
		color: t.text.default,
		fontSize: t.font.size.caption,
	},
	"root",
);
export const label = style({ color: t.text.label }, "label");
export const valueLabel = style(
	{
		color: t.text.hint,
		fontVariantNumeric: "tabular-nums",
	},
	"valueLabel",
);
const mdTrack = { height: t.space["2"] };
export const track = recipe(
	{
		base: {
			height: t.space["1"],
			borderRadius: t.radius.full,
			background: t.surface.inputAccent,
			overflow: "hidden",
			selectors: { '[data-size="md"] &': mdTrack },
		},
		variants: { size: { sm: {}, md: mdTrack } },
	},
	"track",
);
export const fill = style(
	{
		height: "100%",
		width: "var(--cui-progress-fill-width)",
		background: t.action.brand.base,
		borderRadius: t.radius.full,
		selectors: {
			"&[data-indeterminate]": {
				width: "100%",
				animation: `${pulse} calc(${t.motion.duration.slow} * 4) ${t.motion.ease.out} infinite alternate`,
			},
		},
		"@media": {
			"(prefers-reduced-motion: reduce)": {
				selectors: { "&[data-indeterminate]": { animation: "none" } },
			},
		},
	},
	"fill",
);
