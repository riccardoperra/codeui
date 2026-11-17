import * as styles from "../components/CommandMenu/CommandMenu.css";
import { mergeClasses } from "../utils/css";
export const commandMenuParts = {
	trigger: "command-menu-trigger",
	overlay: "command-menu-overlay",
	content: "command-menu-content",
	title: "command-menu-title",
	search: "command-menu-search",
	searchInput: "command-menu-search-input",
	hint: "command-menu-hint",
	listbox: "command-menu-listbox",
	group: "command-menu-group",
	groupLabel: "command-menu-group-label",
	item: "command-menu-item",
	leading: "command-menu-leading",
	itemLabel: "command-menu-item-label",
	itemDescription: "command-menu-item-description",
	itemIndicator: "command-menu-item-indicator",
	shortcut: "command-menu-shortcut",
	empty: "command-menu-empty",
} as const;
export type CommandMenuPart = keyof typeof commandMenuParts;
export type CommandMenuClasses = Partial<Record<CommandMenuPart, string>>;
export type CommandMenuStyles = Record<CommandMenuPart, () => string>;
export const commandMenuStyles: CommandMenuStyles = {
	trigger: () => styles.trigger,
	overlay: () => styles.overlay,
	content: () => styles.content,
	title: () => styles.title,
	search: () => styles.search,
	searchInput: () => styles.searchInput,
	hint: () => styles.hint,
	listbox: () => styles.listbox,
	group: () => styles.group,
	groupLabel: () => styles.groupLabel,
	item: () => styles.item,
	leading: () => styles.leading,
	itemLabel: () => styles.itemLabel,
	itemDescription: () => styles.itemDescription,
	itemIndicator: () => styles.itemIndicator,
	shortcut: () => styles.shortcut,
	empty: () => styles.empty,
};
