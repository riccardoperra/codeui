import { style } from "@vanilla-extract/css";
import { textFieldVars } from "../../TextField/TextField.css";
import { styleFieldMessage } from "../fieldStyle";

export const description = style([
	styleFieldMessage({
		xs: "xs",
		sm: "xs",
		md: "xs",
		lg: "sm",
		xl: "md",
	}),
	{
		color: textFieldVars.descriptionColor,
		userSelect: "none",
	},
]);
