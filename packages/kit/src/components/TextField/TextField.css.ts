import { style } from "@vanilla-extract/css";
import { themeTokens } from "../../foundation/themes.css";
import { baseFieldTheme } from "../Field/Field.css";

export const baseFieldContainer = style([
	baseFieldTheme,
	{
		display: "flex",
		flexDirection: "column",
		gap: themeTokens.spacing["3"],
	},
]);

export const textField = style([
	{
		paddingRight: themeTokens.spacing["3"],
		paddingLeft: themeTokens.spacing["3"],
		paddingTop: 0,
		paddingBottom: 0,
		outline: "none",
	},
]);
