import * as styles from "../components/Switch/Switch.css";
import { label as fieldLabel } from "../components/Field/FieldLabel/FieldLabel.css";
import { mergeClasses } from "../utils/css";
export const switchParts = {
	root: "switch-root",
	input: "switch-input",
	control: "switch-control",
	thumb: "switch-thumb",
	label: "switch-label",
	description: "switch-description",
	errorMessage: "switch-error-message",
} as const;
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

export type SwitchStyleOptions = SwitchVariants & { class?: string };

function partStyleProps<Part extends SwitchPart>(part: Part) {
	return ({ size, class: className }: SwitchStyleOptions = {}) => ({
		class: mergeClasses(
			switchStyles[part](),
			className,
			part === "label" ? fieldLabel : undefined,
		),
		"data-cui": switchParts[part],
		"data-size": size,
	});
}

export const switchStyleProps = {
	root: partStyleProps("root"),
	input: partStyleProps("input"),
	control: partStyleProps("control"),
	thumb: partStyleProps("thumb"),
	label: partStyleProps("label"),
	description: partStyleProps("description"),
	errorMessage: partStyleProps("errorMessage"),
};
