import { style } from "../foundation/layer.css";
import { createVar, fallbackVar } from "@vanilla-extract/css";

export const iconSize = createVar();

export const icon = style({
	width: fallbackVar(iconSize, "1.1em"),
	height: fallbackVar(iconSize, "1.1em"),
});
