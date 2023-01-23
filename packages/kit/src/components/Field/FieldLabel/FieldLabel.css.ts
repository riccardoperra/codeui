import { style } from "@vanilla-extract/css";
import { themeTokens } from "../../../foundation/themes.css";
import { styleFieldMessage } from "../fieldStyle";

export const label = style([
	styleFieldMessage({
		xs: "xs",
		sm: "sm",
		md: "sm",
		lg: "md",
		xl: "md",
	}),
	{
		fontWeight: themeTokens.fontWeight.medium,
		userSelect: "none",
	},
]);
