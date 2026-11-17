import * as styles from "../components/Spinner/Spinner.css";
import { mergeClasses } from "../utils/css";
export const spinnerParts = {
	root: "spinner-root",
	track: "spinner-track",
	indicator: "spinner-indicator",
} as const;

export type SpinnerPart = keyof typeof spinnerParts;
export type SpinnerClasses = Partial<Record<SpinnerPart, string>>;
export type SpinnerSize = "sm" | "md" | "lg";
export type SpinnerVariants = { size?: SpinnerSize };

export type SpinnerStyles = {
	[P in SpinnerPart]: (variants?: SpinnerVariants) => string;
};

export const spinnerStyles: SpinnerStyles = {
	root: variants => styles.root({ size: variants?.size }),
	track: () => styles.track,
	indicator: () => styles.indicator,
};
