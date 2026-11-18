import { tokens } from "./cui.css";

export type BaseComponentSize = keyof typeof tokens.control.height;

export const ComponentSizes = {
	xs: "xs",
	sm: "sm",
	md: "md",
	lg: "lg",
} as const satisfies { [Size in BaseComponentSize]: Size };

const sizesCss: Record<string, string> = tokens.control.height;

const fontSizesCss = {
	xs: tokens.font.size.xs,
	sm: tokens.font.size.sm,
	md: tokens.font.size.md,
	lg: tokens.font.size.lg,
	xl: tokens.font.size.xl,
};

export const mapSizeValue = (
	size: keyof typeof ComponentSizes,
	sizes: Record<string, string> = sizesCss,
) => {
	return sizes[size];
};

const lineHeightsCss = {
	xs: tokens.font.lineHeight.xs,
	sm: tokens.font.lineHeight.sm,
	md: tokens.font.lineHeight.md,
	lg: tokens.font.lineHeight.md,
	xl: tokens.font.lineHeight.md,
};

/** The line height that pairs with `mapFontSizeValue(size)`. */
export const mapLineHeightValue = (size: keyof typeof fontSizesCss) => {
	return lineHeightsCss[size];
};

export const mapFontSizeValue = (size: keyof typeof fontSizesCss) => {
	return fontSizesCss[size];
};
