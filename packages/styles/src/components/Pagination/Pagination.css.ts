import { tokens } from "../../foundation/cui.css";
import { createTheme, style } from "../../foundation/layer.css";

export const [paginationTheme, paginationVars] = createTheme(
	{
		paginationItemMargin: tokens.space["0.5"],
	},
	"paginationTheme",
);

export const pagination = style(
	[
		paginationTheme,
		{
			margin: 0,
			padding: 0,
			display: "inline-flex",
			position: "relative",
			fontVariant: "tabular-nums",
		},
	],
	"pagination",
);

export const paginationItem = style(
	{
		margin: `0 ${paginationVars.paginationItemMargin}`,
	},
	"paginationItem",
);

export const paginationIcon = style(
	{
		width: "1.1em",
	},
	"paginationIcon",
);
