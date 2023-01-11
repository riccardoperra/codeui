import { style } from "@vanilla-extract/css";
import { buttonVars } from "../Button/Button.css";

// noinspection JSSuspiciousNameCombination
export const iconButton = style({
	padding: 0,
	width: buttonVars.buttonHeight,
	height: buttonVars.buttonHeight,
});
