import { createVar, fallbackVar, style } from "@vanilla-extract/css";

export const highlightVar = createVar();

export const highlightBlock = style({
	backgroundColor: fallbackVar(highlightVar, "rgb(112, 182, 246, 0.25)"),
});
