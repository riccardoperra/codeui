import { tokens } from "../foundation/cui.css";
import { root } from "../components/Text/Text.css";
import { mergeClasses } from "../utils/css";
export type TextVariants = {
	size?: keyof typeof tokens.font.size;
	weight?: keyof typeof tokens.font.weight;
	tone?: "default" | "muted" | "hint" | "label" | "danger" | "success";
};
export const textParts = { root: "text-root" } as const;
export type TextPart = keyof typeof textParts;
export type TextClasses = Partial<Record<TextPart, string>>;
export type TextStyles = { root: (variants?: TextVariants) => string };
export const textStyles: TextStyles = {
	root: variants =>
		root({ size: variants?.size, weight: variants?.weight, tone: variants?.tone }),
};
