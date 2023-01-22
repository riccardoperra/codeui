import { globalStyle } from "@vanilla-extract/css";
import { tokens } from "../src/foundation/contract.css";

globalStyle("[data-cui-theme=dark] body", {
	background: tokens.accent1,
	color: tokens.foreground,
});

globalStyle("[data-cui-theme=light] body", {
	background: tokens.background,
	color: tokens.foreground,
});
