import { publicStylesRegistry } from "../registry";
import * as styles from "../components/Dialog/Dialog.css";
import { mergeClasses } from "../utils/css";
export const dialogParts = publicStylesRegistry.dialog.parts;

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

type DialogPanelStyleVariants = { size?: DialogSize; chrome?: DialogChrome };
type DialogBodyStyleVariants = { layout?: DialogBodyLayout };
type DialogSectionStyleVariants = { variant?: DialogSectionVariant };

export type DialogStyles = {
	[P in DialogPart]: P extends "panel"
		? (variants?: DialogPanelStyleVariants) => string
		: P extends "body"
			? (variants?: DialogBodyStyleVariants) => string
			: P extends "section"
				? (variants?: DialogSectionStyleVariants) => string
				: () => string;
};

export const dialogStyles: DialogStyles = {
	trigger: () => "cui-" + dialogParts.trigger,
	overlay: () => styles.overlay,
	positioner: () => mergeClasses(styles.dialogTheme, styles.positioner),
	panel: variants =>
		mergeClasses(
			styles.dialogTheme,
			styles.panel({ size: variants?.size, chrome: variants?.chrome }),
		),
	header: () => styles.title,
	title: () => "cui-" + dialogParts.title,
	description: () => styles.description,
	closeButton: () => "cui-" + dialogParts.closeButton,
	body: () => styles.panelContent,
	footer: () => styles.panelFooter,
	sidebar: () => styles.sidebar,
	sidebarSearch: () => styles.sidebarSearch,
	nav: () => styles.nav,
	navItem: () => styles.navItem,
	navIcon: () => styles.navIcon,
	main: () => styles.main,
	section: variants => styles.section({ variant: variants?.variant }),
	sectionTitle: () => styles.sectionTitle,
	sectionContent: () => styles.sectionContent,
};

export const dialogDefaults = publicStylesRegistry.dialog.defaults;
