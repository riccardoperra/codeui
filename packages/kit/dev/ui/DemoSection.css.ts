import { style } from "@vanilla-extract/css";

export const section = style({
	padding: "2rem",
	borderBottom: "1px solid #333",
});

export const row = style({
	display: "flex",
	gap: "2rem",
	padding: "1rem",
	alignItems: "center",
});
