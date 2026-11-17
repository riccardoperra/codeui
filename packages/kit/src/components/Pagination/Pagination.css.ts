import { tokens } from "../../foundation/cui.css";
import { createTheme, style } from "../../foundation/layer.css";

export const [paginationTheme, paginationVars] = createTheme({
	paginationItemMargin: tokens.space["0.5"],
});

export const pagination = style([
	paginationTheme,
	{
		margin: 0,
		padding: 0,
		display: "inline-flex",
		position: "relative",
		fontVariant: "tabular-nums",
	},
]);

export const paginationItem = style({
	margin: `0 ${paginationVars.paginationItemMargin}`,
});

export const paginationIcon = style({
	width: "1.1em",
});
