import { tokens } from "./cui.css";

export type BaseComponentSize = "xs" | "sm" | "md" | "lg" | "xl";

export const ComponentSizes = {
	xs: "xs",
	sm: "sm",
	md: "md",
	lg: "lg",
	xl: "xl",
} as const;

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

export const mapFontSizeValue = (size: BaseComponentSize) => {
	return fontSizesCss[size];
};
