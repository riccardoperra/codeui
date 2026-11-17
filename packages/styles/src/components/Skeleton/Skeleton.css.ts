import { keyframes } from "@vanilla-extract/css";
import { globalStyle, recipe, style } from "../../foundation/layer.css";
import { tokens } from "../../foundation/cui.css";

const pulse = keyframes({ to: { opacity: 0.55 } }, "pulse");

const base = style(
	{
		display: "block",
		borderRadius: tokens.radius.xs,
		selectors: {
			"&[data-visible]": {
				backgroundColor: tokens.action.neutral.base,
				color: "transparent",
				pointerEvents: "none",
				userSelect: "none",
			},
		},
	},
	"base",
);

globalStyle(`${base}[data-visible] *`, { visibility: "hidden" });

export const root = recipe(
	{
		base,
		variants: {
			circle: {
				true: { borderRadius: tokens.radius.full },
			},
			animate: {
				true: {
					selectors: {
						"&[data-visible]": {
							animation: `${pulse} calc(${tokens.motion.duration.slow} * 4) ${tokens.motion.ease.out} infinite alternate`,
						},
					},
					"@media": {
						"(prefers-reduced-motion: reduce)": {
							selectors: { "&[data-visible]": { animation: "none" } },
						},
					},
				},
			},
		},
		defaultVariants: { animate: true },
	},
	"root",
);
