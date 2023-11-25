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

export const textArea = style([
	{
		paddingRight: themeTokens.spacing["3"],
		paddingLeft: themeTokens.spacing["3"],
		paddingTop: themeTokens.spacing["2"],
		paddingBottom: themeTokens.spacing["2"],
		outline: "none",
	},
]);
