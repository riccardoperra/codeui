import type { KbdStyleOptions } from "../generated-appearance/kbd";
import * as styles from "../components/Kbd/Kbd.css";
export const kbdParts = {
	root: "kbd-root",
} as const;

export type KbdPart = keyof typeof kbdParts;
export type KbdClasses = Partial<Record<KbdPart, string>>;
export type KbdSize = NonNullable<KbdStyleOptions["size"]>;
export type KbdVariant = NonNullable<KbdStyleOptions["variant"]>;
export type KbdVariants = { size?: KbdSize; variant?: KbdVariant };

export type KbdStyles = { [P in KbdPart]: () => string };

export const kbdStyles: KbdStyles = {
	root: styles.root,
};
