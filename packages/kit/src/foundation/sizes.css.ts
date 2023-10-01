import { themeTokens } from "./themes.css";

export type BaseComponentSize = "xs" | "sm" | "md" | "lg" | "xl";

export const ComponentSizes = {
	xs: "xs",
	sm: "sm",
	md: "md",
	lg: "lg",
	xl: "xl",
} as const;

const sizesCss = {
	xs: "30px",
	sm: "36px",
	md: "40px",
	lg: "48px",
	xl: "56px",
};

const fontSizesCss = {
	xs: themeTokens.fontSize.xs,
	sm: themeTokens.fontSize.sm,
	md: themeTokens.fontSize.md,
	lg: themeTokens.fontSize.lg,
	xl: themeTokens.fontSize.xl,
};

export const mapSizeValue = (
	size: keyof typeof ComponentSizes,
	sizes: Record<string, string> = sizesCss,
) => {
	return sizes[size];
};

export const mapFontSizeValue = (size: BaseComponentSize) => {
	return fontSizesCss[size];
};
