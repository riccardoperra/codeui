import { style } from "../foundation/public.css";
import { createVar, fallbackVar } from "@vanilla-extract/css";

export const iconSize = createVar("iconSize");

export const iconRule = {
	width: fallbackVar(iconSize, "1.1em"),
	height: fallbackVar(iconSize, "1.1em"),
};
export const icon = style(iconRule, "icon");
