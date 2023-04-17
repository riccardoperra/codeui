import { globalStyle, style } from "@vanilla-extract/css";
import { tokens } from "../../kit/src/foundation/contract.css";
import { themeTokens } from "../../kit/src/foundation/themes.css";

globalStyle("html, body", {
	fontFamily:
		'"Manrope", -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"',
});

globalStyle("[data-cui-theme=dark] body", {
	background: tokens.accent1,
	color: tokens.foreground,
});

globalStyle("[data-cui-theme=light] body", {
	background: tokens.background,
	color: tokens.foreground,
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
	background: tokens.brand,
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
