import type { DialogStyleOptions } from "../../generated-appearance/dialog";
export const description: string = "cui-dialog-description";
export const dialogThemeVars = {
	contentBackground: "var(--cui-dialog-content-background)" as `var(--${string})`,
	contentBoxShadow: "var(--cui-dialog-content-box-shadow)" as `var(--${string})`,
	contentTextColor: "var(--cui-dialog-content-text-color)" as `var(--${string})`,
	contentPadding: "var(--cui-dialog-content-padding)" as `var(--${string})`,
	titleHeight: "var(--cui-dialog-title-height)" as `var(--${string})`,
	panelRadius: "var(--cui-dialog-panel-radius)" as `var(--${string})`,
	dividerColor: "var(--cui-dialog-divider-color)" as `var(--${string})`,
	titleFontSize: "var(--cui-dialog-title-font-size)" as `var(--${string})`,
	overlayBackground: "var(--cui-dialog-overlay-background)" as `var(--${string})`,
	gutter: "var(--cui-dialog-gutter)" as `var(--${string})`,
	width: "var(--cui-dialog-width)" as `var(--${string})`,
	height: "var(--cui-dialog-height)" as `var(--${string})`,
	sidebarBackground: "var(--cui-dialog-sidebar-background)" as `var(--${string})`,
	navCurrentBackground:
		"var(--cui-dialog-nav-current-background)" as `var(--${string})`,
	mainBackground: "var(--cui-dialog-main-background)" as `var(--${string})`,
	islandBackground: "var(--cui-dialog-island-background)" as `var(--${string})`,
	splitColumns: "var(--cui-dialog-split-columns)" as `var(--${string})`,
};
export const main: string = "cui-dialog-main";
export const nav: string = "cui-dialog-nav";
export const navIcon: string = "cui-dialog-nav-icon";
export const navItem: string = "cui-dialog-nav-item";
export const navList: string = "cui-dialog-nav-list";
export const overlay: string = "cui-dialog-overlay";
export const panel = (): string => "cui-dialog-panel";
export const panelContent: string = "cui-dialog-panel-content";
export const panelFooter: string = "cui-dialog-panel-footer";
export const positioner: string = "cui-dialog-positioner";
export const section = (): string => "cui-dialog-section";
export const sectionContent: string = "cui-dialog-section-content";
export const sectionTitle: string = "cui-dialog-section-title";
export const sidebar: string = "cui-dialog-sidebar";
export const sidebarSearch: string = "cui-dialog-sidebar-search";
export const title: string = "cui-dialog-title";

export type DialogPanelVariants =
	| (Omit<DialogStyleOptions, "class" | "chrome"> & {
			chrome?: NonNullable<DialogStyleOptions["chrome"]> | "bar";
	  })
	| undefined;
