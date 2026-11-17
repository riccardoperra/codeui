import { style } from "../../foundation/layer.css";
import { tokens } from "../../foundation/cui.css";
import { baseFieldTheme } from "../Field/Field.css";

export const baseFieldContainer = style(
	[
		baseFieldTheme,
		{
			display: "flex",
			flexDirection: "column",
			gap: tokens.space["3"],
		},
	],
	"baseFieldContainer",
);

export const textArea = style(
	[
		{
			paddingRight: tokens.space["3"],
			paddingLeft: tokens.space["3"],
			paddingTop: tokens.space["2"],
			paddingBottom: tokens.space["2"],
			outline: "none",
		},
	],
	"textArea",
);
