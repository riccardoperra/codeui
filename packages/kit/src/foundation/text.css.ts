import { styleVariants } from "@vanilla-extract/css";
import { themeTokens } from "@codeui/kit";
import { mapToProperty } from "./mapToProperty";

export const fontWeight = styleVariants(
	themeTokens.fontWeight,
	mapToProperty("fontWeight"),
);

export const fontSize = styleVariants(themeTokens.fontSize, mapToProperty("fontSize"));
