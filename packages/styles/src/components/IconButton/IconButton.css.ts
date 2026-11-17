import { style } from "../../foundation/layer.css";
import { buttonVars } from "../Button/Button.css";

// noinspection JSSuspiciousNameCombination
export const iconButton = style(
	{
		padding: 0,
		width: buttonVars.buttonHeight,
		height: buttonVars.buttonHeight,
	},
	"iconButton",
	"overrides",
);
