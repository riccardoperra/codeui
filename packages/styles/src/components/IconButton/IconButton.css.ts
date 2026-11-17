import { squareButtonRule } from "../Button/composition";
import { finish } from "../../foundation/public.css";
import { publicStylesRegistry as registry } from "../../registry";
import { style } from "../../foundation/public.css";
import { buttonVars } from "../Button/Button.css";

// noinspection JSSuspiciousNameCombination
export const iconButton = style(
	squareButtonRule(buttonVars.buttonHeight),
	"iconButton",
	registry.iconButton.parts.iconButton,
);

finish();

export const iconButtonPart = registry.iconButton.parts.iconButton;
