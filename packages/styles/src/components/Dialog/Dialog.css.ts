// Compatibility metadata frozen from #126; declarations are authored in src/plain.
import type * as Contract from "./Dialog.css.contract";
import { recipe } from "../../plain/recipe";
export const description: typeof Contract.description = "cui-dialog-description";
export const dialogTheme: typeof Contract.dialogTheme = "cui-dialog-dialogTheme";
export const dialogThemeVars: typeof Contract.dialogThemeVars = {
	contentBackground: "var(--cui-dialogTheme-contentBackground)",
	contentBoxShadow: "var(--cui-dialogTheme-contentBoxShadow)",
	contentTextColor: "var(--cui-dialogTheme-contentTextColor)",
	contentPadding: "var(--cui-dialogTheme-contentPadding)",
	titleHeight: "var(--cui-dialogTheme-titleHeight)",
	panelRadius: "var(--cui-dialogTheme-panelRadius)",
	dividerColor: "var(--cui-dialogTheme-dividerColor)",
	titleFontSize: "var(--cui-dialogTheme-titleFontSize)",
	overlayBackground: "var(--cui-dialogTheme-overlayBackground)",
	gutter: "var(--cui-dialogTheme-gutter)",
	width: "var(--cui-dialogTheme-width)",
	height: "var(--cui-dialogTheme-height)",
	sidebarBackground: "var(--cui-dialogTheme-sidebarBackground)",
	navCurrentBackground: "var(--cui-dialogTheme-navCurrentBackground)",
	mainBackground: "var(--cui-dialogTheme-mainBackground)",
	islandBackground: "var(--cui-dialogTheme-islandBackground)",
	splitColumns: "var(--cui-dialogTheme-splitColumns)",
};
export const main: typeof Contract.main = "cui-dialog-main";
export const nav: typeof Contract.nav = "cui-dialog-nav";
export const navIcon: typeof Contract.navIcon = "cui-dialog-nav-icon";
export const navItem: typeof Contract.navItem = "cui-dialog-nav-item";
export const navList: typeof Contract.navList = "cui-dialog-navList";
export const overlay: typeof Contract.overlay = "cui-dialog-overlay";
export const panel: typeof Contract.panel = recipe(
	{
		base: "cui-dialog-2yx8y1g",
		variants: {
			size: {
				xs: "cui-dialog-panel_size_xs",
				sm: "cui-dialog-panel_size_sm",
				md: "cui-dialog-panel_size_md",
				lg: "cui-dialog-panel_size_lg",
				xl: "cui-dialog-panel_size_xl",
				full: "cui-dialog-panel_size_full",
				settings: "cui-dialog-panel_size_settings",
				export: "cui-dialog-panel_size_export",
			},
			chrome: {
				bar: "cui-dialog-panel_chrome_bar",
				inset: "cui-dialog-panel_chrome_inset",
			},
		},
	},
	{ chrome: "bar" },
	"cui-dialog-panel",
);
export const panelContent: typeof Contract.panelContent = "cui-dialog-panel-content";
export const panelFooter: typeof Contract.panelFooter = "cui-dialog-panel-footer";
export const positioner: typeof Contract.positioner = "cui-dialog-positioner";
export const section: typeof Contract.section = recipe(
	{
		base: "cui-dialog-2yx8y1u",
		variants: {
			variant: {
				group: "cui-dialog-section_variant_group",
				well: "cui-dialog-section_variant_well",
			},
		},
	},
	{ variant: "group" },
	"cui-dialog-section",
);
export const sectionContent: typeof Contract.sectionContent =
	"cui-dialog-section-content";
export const sectionTitle: typeof Contract.sectionTitle = "cui-dialog-section-title";
export const sidebar: typeof Contract.sidebar = "cui-dialog-sidebar";
export const sidebarSearch: typeof Contract.sidebarSearch = "cui-dialog-sidebar-search";
export const splitBody: typeof Contract.splitBody = "cui-dialog-splitBody";
export const title: typeof Contract.title = "cui-dialog-panel-title";
export type DialogPanelVariants = Contract.DialogPanelVariants;
