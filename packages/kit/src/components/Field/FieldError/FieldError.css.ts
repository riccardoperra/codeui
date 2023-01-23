import { style } from "@vanilla-extract/css";
import { tokens } from "../../../foundation/contract.css";
import { styleFieldMessage } from "../fieldStyle";

export const errorMessage = style([
	styleFieldMessage({
		xs: "xs",
		sm: "xs",
		md: "xs",
		lg: "sm",
		xl: "sm",
	}),
	{
		userSelect: "none",
		color: tokens.critical,
	},
]);
