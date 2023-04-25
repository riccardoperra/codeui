import { style } from "@vanilla-extract/css";
import { tokens } from "../../../../kit/src/foundation/contract.css";
import { themeTokens } from "../../../../kit/src/foundation/themes.css";

export const sidebar = style({
	width: "256px",
	backgroundColor: tokens.formAccent,
	height: "100vh",
	gap: "1rem",
	padding: themeTokens.spacing["4"],
	display: "flex",
	flexDirection: "column",
});

export const sidebarItem = style({
	textDecoration: "none",
	minHeight: "2.5rem",
	width: "100%",
	listStyle: "none",
	color: tokens.foreground,
});
