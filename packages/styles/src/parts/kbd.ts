import * as styles from "../components/Kbd/Kbd.css";
export const kbdParts = {
	root: "kbd-root",
} as const;

export type KbdPart = keyof typeof kbdParts;
export type KbdClasses = Partial<Record<KbdPart, string>>;
export type KbdSize = "sm" | "md";
export type KbdVariant = "keycap" | "hint";
export type KbdVariants = { size?: KbdSize; variant?: KbdVariant };

export type KbdStyles = { [P in KbdPart]: () => string };

export const kbdStyles: KbdStyles = {
	root: styles.root,
};
