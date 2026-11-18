import * as styles from "../components/CommandMenu/CommandMenu.css";
import { mergeClasses } from "../utils/css";
export const commandMenuParts = {
	trigger: "commandmenu-trigger",
	overlay: "commandmenu-overlay",
	content: "commandmenu-content",
	title: "commandmenu-title",
	search: "commandmenu-search",
	searchInput: "commandmenu-search-input",
	hint: "commandmenu-hint",
	listbox: "commandmenu-listbox",
	group: "commandmenu-group",
	groupLabel: "commandmenu-group-label",
	item: "commandmenu-item",
	leading: "commandmenu-leading",
	itemLabel: "commandmenu-item-label",
	itemDescription: "commandmenu-item-description",
	itemIndicator: "commandmenu-item-indicator",
	shortcut: "commandmenu-shortcut",
	empty: "commandmenu-empty",
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
