import { styleVariants } from "./layer.css";
import { mapToProperty } from "./mapToProperty";
import { themeTokens } from "./themes.css";

export const fontWeight = styleVariants(
	themeTokens.fontWeight,
	mapToProperty("fontWeight"),
	"fontWeight",
);

export const fontSize = styleVariants(
	themeTokens.fontSize,
	mapToProperty("fontSize"),
	"fontSize",
);
