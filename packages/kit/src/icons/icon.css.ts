import { createVar, fallbackVar, style } from "@vanilla-extract/css";

export const iconSize = createVar();

export const icon = style({
	width: fallbackVar(iconSize, "1.1em"),
	height: fallbackVar(iconSize, "1.1em"),
});
