import { createTheme, style } from "@vanilla-extract/css";

export const [paginationTheme, paginationVars] = createTheme({
	paginationItemMargin: `0.125rem`,
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
	width: "1em",
});
