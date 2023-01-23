import { style } from "@vanilla-extract/css";
import { textFieldVars } from "../../TextField/TextField.css";
import { styleFieldMessage } from "../Field.css";

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
