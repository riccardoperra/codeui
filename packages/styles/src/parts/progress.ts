import type { ProgressStyleOptions } from "../generated-appearance/progress";
import * as styles from "../components/Progress/Progress.css";
export type ProgressVariants = Omit<ProgressStyleOptions, "class">;
export const progressParts = {
	root: "progress",
	label: "progress-label",
	track: "progress-track",
	fill: "progress-fill",
	valueLabel: "progress-value-label",
} as const;
export type ProgressPart = keyof typeof progressParts;
export type ProgressClasses = Partial<Record<ProgressPart, string>>;
export type ProgressStyles = Record<ProgressPart, () => string>;
export const progressStyles: ProgressStyles = {
	root: () => styles.root,
	label: () => styles.label,
	track: styles.track,
	fill: () => styles.fill,
	valueLabel: () => styles.valueLabel,
};
