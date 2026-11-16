import { style } from "../../../foundation/layer.css";
import { tokens } from "../../../foundation/cui.css";
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
		fontWeight: tokens.font.weight.medium,
		color: tokens.text.label,
		userSelect: "none",
	},
]);
