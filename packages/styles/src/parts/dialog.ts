import * as styles from "../components/Dialog/Dialog.css";
import { mergeClasses } from "../utils/css";
export const dialogParts = {
	trigger: "dialog-trigger",
	overlay: "dialog-overlay",
	positioner: "dialog-positioner",
	panel: "dialog-panel",
	header: "dialog-panel-title",
	title: "dialog-title",
	description: "dialog-description",
	closeButton: "dialog-close-button",
	body: "dialog-panel-content",
	footer: "dialog-panel-footer",
	sidebar: "dialog-sidebar",
	sidebarSearch: "dialog-sidebar-search",
	nav: "dialog-nav",
	navItem: "dialog-nav-item",
	navIcon: "dialog-nav-icon",
	main: "dialog-main",
	section: "dialog-section",
	sectionTitle: "dialog-section-title",
	sectionContent: "dialog-section-content",
} as const;

export type DialogPart = keyof typeof dialogParts;

export type DialogThemeVar =
	| "contentBackground"
	| "contentBoxShadow"
	| "contentTextColor"
	| "contentPadding"
	| "titleHeight"
	| "panelRadius"
	| "dividerColor"
	| "titleFontSize"
	| "overlayBackground"
	| "gutter"
	| "width"
	| "height"
	| "sidebarBackground"
	| "navCurrentBackground"
	| "mainBackground"
	| "islandBackground"
	| "splitColumns";

/**
 * The dialog's local variables, such as `width`, `height` and `gutter`, as
 * `var(--…)` strings. Set them on the panel with vanilla-extract `vars` or
 * `assignInlineVars`.
 */
export const dialogThemeVars: Readonly<Record<DialogThemeVar, string>> =
	styles.dialogThemeVars;
export type DialogClasses = Partial<Record<DialogPart, string>>;
/**
 * Width of the panel. `settings` is 1000×680 for a sidebar and a pane;
 * `export` is 800 wide for a preview beside its options. Both shrink to fit
 * the viewport.
 */
export type DialogSize =
	| "xs"
	| "sm"
	| "md"
	| "lg"
	| "xl"
	| "full"
	| "settings"
	| "export";
/**
 * `bar` puts the title in a bar with a divider. `inset` puts it in the panel
 * padding with no divider, a ghost close button and 24px corners.
 */
export type DialogChrome = "bar" | "inset";
/** `auto` animates pointer opens and closes. `none` never animates. */
export type DialogMotion = "auto" | "none";
/** `split` puts the first child, a preview, beside the second, its options. */
export type DialogBodyLayout = "split";
export type DialogSectionVariant = "group" | "well";

export type DialogStyles = Record<DialogPart, () => string>;

export const dialogStyles: DialogStyles = {
	trigger: () => "",
	overlay: () => styles.overlay,
	positioner: () => mergeClasses(styles.dialogTheme, styles.positioner),
	panel: () => mergeClasses(styles.dialogTheme, styles.panel()),
	header: () => styles.title,
	title: () => "",
	description: () => styles.description,
	closeButton: () => "",
	body: () => styles.panelContent,
	footer: () => styles.panelFooter,
	sidebar: () => styles.sidebar,
	sidebarSearch: () => styles.sidebarSearch,
	nav: () => styles.nav,
	navItem: () => styles.navItem,
	navIcon: () => styles.navIcon,
	main: () => styles.main,
	section: styles.section,
	sectionTitle: () => styles.sectionTitle,
	sectionContent: () => styles.sectionContent,
};
