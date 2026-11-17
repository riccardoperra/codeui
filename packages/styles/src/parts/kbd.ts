import * as styles from "../components/Kbd/Kbd.css";
import { mergeClasses } from "../utils/css";
export const kbdParts = {
	root: "kbd-root",
} as const;

export type KbdPart = keyof typeof kbdParts;
export type KbdClasses = Partial<Record<KbdPart, string>>;
export type KbdSize = "sm" | "md";
export type KbdVariant = "keycap" | "hint";
export type KbdVariants = { size?: KbdSize; variant?: KbdVariant };

export type KbdStyles = { [P in KbdPart]: (variants?: KbdVariants) => string };

export const kbdStyles: KbdStyles = {
	root: variants => styles.root({ size: variants?.size, variant: variants?.variant }),
};
