import * as styles from "../components/Switch/Switch.css";
import type { SwitchStyleOptions } from "../generated-appearance/switch";
export const switchParts = {
	root: "switch",
	input: "switch-input",
	control: "switch-control",
	thumb: "switch-thumb",
	label: "switch-label",
	description: "switch-description",
	errorMessage: "switch-error-message",
} as const;
export type SwitchVariants = Omit<SwitchStyleOptions, "class">;
export type SwitchPart =
	| "root"
	| "input"
	| "control"
	| "thumb"
	| "label"
	| "description"
	| "errorMessage";
export type SwitchClasses = Partial<Record<SwitchPart, string>>;
export type SwitchStyles = Record<SwitchPart, () => string>;
export const switchStyles: SwitchStyles = {
	root: () => styles.root,
	input: () => styles.input,
	control: styles.control,
	thumb: styles.thumb,
	label: () => styles.label,
	description: () => styles.description,
	errorMessage: () => styles.errorMessage,
};
