import type { SettingsStyleOptions } from "../generated-appearance/settings";
import * as styles from "../components/Settings/Settings.css";
import { mergeClasses } from "../utils/css";
export const settingsRowParts = {
	root: "settings-row",
	label: "settings-row-label",
	description: "settings-row-description",
	details: "settings-row-details",
	control: "settings-row-control",
	picture: "settings-row-picture",
	marker: "settings-row-marker",
} as const;
export type SettingsRowPart = keyof typeof settingsRowParts;
export type SettingsRowClasses = Partial<Record<SettingsRowPart, string>>;
export type SettingsRowLayout = NonNullable<SettingsStyleOptions["layout"]> | "inline";
export type SettingsRowVariants = {
	layout?: SettingsRowLayout;
	compactControl?: boolean;
};
export type SettingsRowStyles = {
	[P in SettingsRowPart]: (variants?: SettingsRowVariants) => string;
};
export const settingsRowStyles: SettingsRowStyles = {
	root: () => styles.row,
	label: () => styles.label,
	description: () => styles.description,
	details: () => styles.details,
	control: () => styles.control,
	picture: () => styles.picture,
	marker: () => styles.marker,
};

export const settingsGroupParts = {
	root: "settings-group",
	title: "settings-group-title",
	description: "settings-group-description",
	content: "settings-group-content",
} as const;
export type SettingsGroupPart = keyof typeof settingsGroupParts;
export type SettingsGroupClasses = Partial<Record<SettingsGroupPart, string>>;
export type SettingsGroupStyles = {
	[P in SettingsGroupPart]: (variants?: {}) => string;
};
export const settingsGroupStyles: SettingsGroupStyles = {
	root: () => styles.group,
	title: () => styles.groupTitle,
	description: () => styles.groupDescription,
	content: () => styles.groupContent,
};
