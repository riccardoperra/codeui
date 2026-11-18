import type { DialogStyleOptions } from "../../generated-appearance/dialog";
export const description: string = "cui-dialog-description";
export const dialogTheme: string = "cui-dialog-dialogTheme";
export const dialogThemeVars = {
	contentBackground: "var(--cui-dialogTheme-contentBackground)" as `var(--${string})`,
	contentBoxShadow: "var(--cui-dialogTheme-contentBoxShadow)" as `var(--${string})`,
	contentTextColor: "var(--cui-dialogTheme-contentTextColor)" as `var(--${string})`,
	contentPadding: "var(--cui-dialogTheme-contentPadding)" as `var(--${string})`,
	titleHeight: "var(--cui-dialogTheme-titleHeight)" as `var(--${string})`,
	panelRadius: "var(--cui-dialogTheme-panelRadius)" as `var(--${string})`,
	dividerColor: "var(--cui-dialogTheme-dividerColor)" as `var(--${string})`,
	titleFontSize: "var(--cui-dialogTheme-titleFontSize)" as `var(--${string})`,
	overlayBackground: "var(--cui-dialogTheme-overlayBackground)" as `var(--${string})`,
	gutter: "var(--cui-dialogTheme-gutter)" as `var(--${string})`,
	width: "var(--cui-dialogTheme-width)" as `var(--${string})`,
	height: "var(--cui-dialogTheme-height)" as `var(--${string})`,
	sidebarBackground: "var(--cui-dialogTheme-sidebarBackground)" as `var(--${string})`,
	navCurrentBackground:
		"var(--cui-dialogTheme-navCurrentBackground)" as `var(--${string})`,
	mainBackground: "var(--cui-dialogTheme-mainBackground)" as `var(--${string})`,
	islandBackground: "var(--cui-dialogTheme-islandBackground)" as `var(--${string})`,
	splitColumns: "var(--cui-dialogTheme-splitColumns)" as `var(--${string})`,
};
export const main: string = "cui-dialog-main";
export const nav: string = "cui-dialog-nav";
export const navIcon: string = "cui-dialog-navIcon";
export const navItem: string = "cui-dialog-navItem";
export const navList: string = "cui-dialog-navList";
export const overlay: string = "cui-dialog-overlay cui-dialog-dialogTheme";
export const panel = (): string => "cui-dialog-panel";
export const panelContent: string = "cui-dialog-panelContent";
export const panelFooter: string = "cui-dialog-panelFooter";
export const positioner: string = "cui-dialog-positioner";
export const section = (): string => "cui-dialog-section";
export const sectionContent: string = "cui-dialog-sectionContent";
export const sectionTitle: string = "cui-dialog-sectionTitle";
export const sidebar: string = "cui-dialog-sidebar";
export const sidebarSearch: string = "cui-dialog-sidebarSearch";
export const title: string = "cui-dialog-title";

export type DialogPanelVariants =
	| (Omit<DialogStyleOptions, "class" | "chrome"> & {
			chrome?: NonNullable<DialogStyleOptions["chrome"]> | "bar";
	  })
	| undefined;
