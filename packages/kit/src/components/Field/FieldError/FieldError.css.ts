import { style } from "../../../foundation/layer.css";
import { tokens } from "../../../foundation/cui.css";
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
		color: tokens.text.danger,
	},
]);
