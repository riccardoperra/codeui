import { style } from "../../foundation/layer.css";
import { tokens } from "../../foundation/cui.css";
import { baseFieldTheme } from "../Field/Field.css";

export const baseFieldContainer = style([
	baseFieldTheme,
	{
		display: "flex",
		flexDirection: "column",
		gap: tokens.space["3"],
	},
]);

export const textField = style([
	{
		paddingRight: tokens.space["3"],
		paddingLeft: tokens.space["3"],
		paddingTop: 0,
		paddingBottom: 0,
		outline: "none",
	},
]);
