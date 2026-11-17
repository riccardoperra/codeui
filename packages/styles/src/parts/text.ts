import { tokens } from "../foundation/cui.css";
import { root } from "../components/Text/Text.css";
export type TextVariants = {
	size?: keyof typeof tokens.font.size;
	weight?: keyof typeof tokens.font.weight;
	tone?: "default" | "muted" | "hint" | "label" | "danger" | "success";
};
export const textParts = { root: "text-root" } as const;
export type TextPart = keyof typeof textParts;
export type TextClasses = Partial<Record<TextPart, string>>;
export type TextStyles = { root: () => string };
export const textStyles: TextStyles = {
	root: root,
};
