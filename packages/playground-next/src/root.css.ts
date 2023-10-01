import { globalStyle, style } from "@vanilla-extract/css";
import { themeTokens, themeVars } from "@codeui/kit";

globalStyle("html, body", {
	fontFamily:
		'"Manrope", -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"',
});

globalStyle("[data-cui-theme=dark] body", {
	background: themeVars.accent1,
	color: themeVars.foreground,
});

globalStyle("[data-cui-theme=light] body", {
	background: themeVars.background,
	color: themeVars.foreground,
});

globalStyle("#root", {
	height: "100%",
});

export const container = style({
	display: "grid",
	gridTemplateColumns: "1fr 1fr",
});

export const header = style({
	height: "40px",
	position: "fixed",
	top: 0,
	left: 0,
	width: "100%",
	background: themeVars.brand,
	display: "flex",
	alignItems: "center",
	paddingLeft: "1rem",
	zIndex: 10,
});

export const content = style({
	marginTop: "40px",
});

export const scaffold = style({
	display: "flex",
	gap: themeTokens.spacing["4"],
});

export const layoutContent = style({
	flex: 1,
});
