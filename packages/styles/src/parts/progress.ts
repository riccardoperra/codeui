import { mergeClasses } from "../utils/css";
import * as styles from "../components/Progress/Progress.css";
export type ProgressVariants = { size?: "sm" | "md" };
export const progressParts = {
	root: "progress-root",
	label: "progress-label",
	track: "progress-track",
	fill: "progress-fill",
	valueLabel: "progress-value-label",
} as const;
export type ProgressPart = keyof typeof progressParts;
export type ProgressClasses = Partial<Record<ProgressPart, string>>;
export type ProgressStyles = Record<
	ProgressPart,
	(variants?: ProgressVariants) => string
>;
export const progressStyles: ProgressStyles = {
	root: () => styles.root,
	label: () => styles.label,
	track: variants => styles.track({ size: variants?.size }),
	fill: () => styles.fill,
	valueLabel: () => styles.valueLabel,
};
