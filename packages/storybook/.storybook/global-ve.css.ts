import { globalStyle } from "@vanilla-extract/css";
import { themeVars } from "@codeui/kit";

globalStyle("[data-cui-theme=dark] body", {
	background: themeVars.accent1,
	color: themeVars.foreground,
});

globalStyle("[data-cui-theme=light] body", {
	background: themeVars.background,
	color: themeVars.foreground,
});
