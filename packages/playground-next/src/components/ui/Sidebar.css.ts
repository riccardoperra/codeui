import { style } from "@vanilla-extract/css";
import { tokens } from "../../../../kit/src/foundation/contract.css";
import { themeTokens } from "../../../../kit/src/foundation/themes.css";

export const sidebar = style({
	width: "256px",
	backgroundColor: tokens.formAccent,
	height: "100vh",
	padding: themeTokens.spacing["4"],
});

export const sidebarItem = style({
	textDecoration: "none",
	minHeight: "2.5rem",
	width: "100%",
	listStyle: "none",
	color: tokens.foreground,
});

export const sidebar