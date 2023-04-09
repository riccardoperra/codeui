import { globalStyle } from "@vanilla-extract/css";
import { tokens } from "../../kit/src/foundation/contract.css";

globalStyle("html, body", {
	fontFamily:
		'Mona Sans, -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"',
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
