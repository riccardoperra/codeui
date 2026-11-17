import { keyframes } from "@vanilla-extract/css";
import { recipe, style } from "../../foundation/layer.css";
import { tokens } from "../../foundation/cui.css";

const spin = keyframes({ to: { transform: "rotate(360deg)" } }, "spin");

export const root = recipe(
	{
		base: {
			display: "inline-block",
			flexShrink: 0,
			color: "currentColor",
			animation: `${spin} calc(${tokens.motion.duration.slow} * 3) linear infinite`,
			"@media": {
				"(prefers-reduced-motion: reduce)": { animation: "none" },
			},
		},
		variants: {
			size: {
				sm: { width: tokens.space["3"], height: tokens.space["3"] },
				md: { width: tokens.space["4"], height: tokens.space["4"] },
				lg: { width: tokens.space["6"], height: tokens.space["6"] },
			},
		},
		defaultVariants: { size: "md" },
	},
	"root",
);

export const track = style(
	{
		fill: "none",
		stroke: "currentColor",
		opacity: 0.25,
	},
	"track",
);

export const indicator = style(
	{
		fill: "none",
		stroke: "currentColor",
		strokeLinecap: "round",
	},
	"indicator",
);
