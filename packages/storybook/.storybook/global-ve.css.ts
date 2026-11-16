import { globalStyle } from "@vanilla-extract/css";
import { tokens } from "@codeui/kit";

globalStyle("html, body", {
	background: tokens.surface.canvas,
	color: tokens.text.default,
});
