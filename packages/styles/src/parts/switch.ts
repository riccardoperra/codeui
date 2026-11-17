import { publicStylesRegistry } from "../registry";
import { mergeClasses } from "../utils/css";
import * as styles from "../components/Switch/Switch.css";
export const switchParts = publicStylesRegistry.switch.parts;
export type SwitchVariants = { size?: "sm" | "md" };
export type SwitchPart =
	| "root"
	| "input"
	| "control"
	| "thumb"
	| "label"
	| "description"
	| "errorMessage";
export type SwitchClasses = Partial<Record<SwitchPart, string>>;
export type SwitchStyles = Record<SwitchPart, (variants?: SwitchVariants) => string>;
export const switchStyles: SwitchStyles = {
	root: () => styles.root,
	input: () => styles.input,
	control: variants => styles.control({ size: variants?.size ?? publicStylesRegistry.switch.defaults.size }),
	thumb: variants => styles.thumb({ size: variants?.size ?? publicStylesRegistry.switch.defaults.size }),
	label: () => styles.label,
	description: () => styles.description,
	errorMessage: () => styles.errorMessage,
};

export const switchDefaults = publicStylesRegistry.switch.defaults;
