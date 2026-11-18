import type { SpinnerStyleOptions } from "../generated-appearance/spinner";
import * as styles from "../components/Spinner/Spinner.css";
export const spinnerParts = {
	root: "spinner-root",
	track: "spinner-track",
	indicator: "spinner-indicator",
} as const;

export type SpinnerPart = keyof typeof spinnerParts;
export type SpinnerClasses = Partial<Record<SpinnerPart, string>>;
export type SpinnerSize = NonNullable<SpinnerStyleOptions["size"]>;
export type SpinnerVariants = { size?: SpinnerSize };

export type SpinnerStyles = {
	[P in SpinnerPart]: () => string;
};

export const spinnerStyles: SpinnerStyles = {
	root: styles.root,
	track: () => styles.track,
	indicator: () => styles.indicator,
};
