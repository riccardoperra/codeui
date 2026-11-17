import { RecipeVariants } from "../../types.js";
export declare const dialogTheme: string,
	dialogThemeVars: {
		contentBackground: `var(--${string})`;
		contentBoxShadow: `var(--${string})`;
		contentTextColor: `var(--${string})`;
		contentPadding: `var(--${string})`;
		titleHeight: `var(--${string})`;
		panelRadius: `var(--${string})`;
		dividerColor: `var(--${string})`;
		titleFontSize: `var(--${string})`;
		overlayBackground: `var(--${string})`;
		gutter: `var(--${string})`;
		width: `var(--${string})`;
		height: `var(--${string})`;
		sidebarBackground: `var(--${string})`;
		navCurrentBackground: `var(--${string})`;
		mainBackground: `var(--${string})`;
		islandBackground: `var(--${string})`;
		splitColumns: `var(--${string})`;
	};
export declare const overlay: string;
/** The pane next to the sidebar. Holds the header and the body. */
export declare const main: string;
export declare const splitBody: string;
export declare const panelContent: string;
export declare const panelFooter: string;
/**
 * Centers the panel. The scrim is its `::before`, so it can fade in and out
 * with the panel. Keyboard opens and closes set `data-motion=none`.
 */
export declare const positioner: string;
export declare const title: string;
export declare const panel: import("../../types.js").RuntimeFn<{
	size: {
		xs: {
			width: "24rem";
		};
		sm: {
			width: "28rem";
		};
		md: {
			width: "32rem";
		};
		lg: import("../../types.js").StyleRule;
		xl: import("../../types.js").StyleRule;
		full: {
			padding: number;
			margin: number;
			minHeight: "100%";
			width: "100%";
			borderRadius: number;
			height: "100%";
			":focus-visible": {
				boxShadow: "none";
				outline: "none";
			};
		};
		settings: {
			vars: {
				[x: string]: string;
			};
			width: `min(var(--${string}), 100%)`;
			height: `min(var(--${string}), 100%)`;
			"@media": {
				"screen and (max-width: 768px)": {
					height: "100%";
				};
			};
		};
		export: {
			vars: {
				[x: string]: string;
			};
			width: `min(var(--${string}), 100%)`;
			overflowY: "auto";
			overscrollBehavior: "contain";
		};
	};
	chrome: {
		bar: {};
		inset: {
			vars: {
				[x: string]: `var(--${string})`;
			};
			gap: `var(--${string})`;
			padding: `var(--${string})`;
			"@media": {
				"screen and (max-width: 768px)": {
					gap: `var(--${string})`;
					padding: `var(--${string})`;
					selectors: {
						"&:has(> [data-cui=dialog-sidebar])": {
							flexDirection: "column";
						};
					};
				};
			};
			selectors: {
				"&:has(> [data-cui=dialog-sidebar])": {
					flexDirection: "row";
					gap: number;
					padding: number;
				};
			};
		};
	};
}>;
export type DialogPanelVariants = RecipeVariants<typeof panel>;
export declare const description: string;
export declare const sidebar: string;
export declare const sidebarSearch: string;
export declare const nav: string;
export declare const navList: string;
export declare const navItem: string;
export declare const navIcon: string;
export declare const section: import("../../types.js").RuntimeFn<{
	variant: {
		group: {};
		well: {
			padding: `var(--${string})`;
			borderRadius: `var(--${string})`;
			backgroundColor: `var(--${string})`;
		};
	};
}>;
export declare const sectionTitle: string;
export declare const sectionContent: string;
