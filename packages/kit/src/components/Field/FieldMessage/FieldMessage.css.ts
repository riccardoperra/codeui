import { style } from "@vanilla-extract/css";
import { styleFieldMessage } from "../fieldStyle";
import { baseFieldVars } from "../Field.css";

export const description = style([
	styleFieldMessage({
		xs: "xs",
		sm: "xs",
		md: "xs",
		lg: "sm",
		xl: "md",
	}),
	{
		color: baseFieldVars.descriptionColor,
		userSelect: "none",
	},
]);
