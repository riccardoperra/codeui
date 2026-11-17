import { partSelector } from "../../foundation/public.css";
import { finish } from "../../foundation/public.css";
import { publicStylesRegistry as registry } from "../../registry";
import { createTheme, publicRecipe as recipe, style } from "../../foundation/public.css";
import { keyframes } from "@vanilla-extract/css";
import { RecipeVariants } from "@vanilla-extract/recipes";
import { responsiveStyle } from "../../foundation/responsive";
import { ComponentSizes } from "../../foundation/sizes";
import { tokens } from "../../foundation/cui.css";

export const [dialogTheme, dialogThemeVars] = createTheme(
	{
		contentBackground: tokens.surface.dialog,
		contentBoxShadow: tokens.shadow.dialog,
		contentTextColor: tokens.text.dialog,
		contentPadding: tokens.space["6"],
		titleHeight: tokens.control.height.xl,
		panelRadius: tokens.radius.lg,
		dividerColor: tokens.border.dialogTitle,
		titleFontSize: tokens.font.size.lg,
		overlayBackground: tokens.surface.scrim,
		/** Space between the panel and the viewport edges. */
		gutter: tokens.space["2"],
		/** Width of a `settings` or `export` panel, before the viewport caps it. */
		width: "auto",
		/** Height of a `settings` panel, before the viewport caps it. */
		height: "auto",
		/** Fill of the settings sidebar. */
		sidebarBackground: tokens.surface.dialog,
		/** Fill of the current navigation item. */
		navCurrentBackground: tokens.surface.input,
		/** Fill of the pane next to the sidebar. */
		mainBackground: tokens.surface.panel,
		/** Fill of a section island. */
		islandBackground: tokens.surface.canvas,
		/** Columns of a split body: the preview, then the options. */
		splitColumns: "minmax(0, 1.1fr) minmax(0, 1fr)",
	},
	"dialogTheme",
	registry.dialog.parts.panel,
);

const positionerSelector = partSelector(registry.dialog.parts.positioner);
const sectionSelector = partSelector(registry.dialog.parts.section);
const phone = "screen and (max-width: 768px)";
const finePointer = "(hover: hover) and (pointer: fine)";
const reducedMotion = "(prefers-reduced-motion: reduce)";
const ease = tokens.motion.ease.out;
const focusRing = {
	outline: `${tokens.focus.width} solid ${tokens.focus.color}`,
	outlineOffset: tokens.focus.offset,
};

const fadeIn = keyframes({ from: { opacity: 0 } }, "fadeIn");
const fadeOut = keyframes({ to: { opacity: 0 } }, "fadeOut");

// Pop: in from 0.96 with a fade, out toward 0.98.
const contentShow = keyframes(
	{
		from: { opacity: 0, transform: "scale(0.96)" },
	},
	"contentShow",
);

const contentHide = keyframes(
	{
		to: { opacity: 0, transform: "scale(0.98)" },
	},
	"contentHide",
);

const still = "&[data-motion=none], &[data-motion=none][data-expanded]";

export const overlay = style(
	[
		dialogTheme,
		{
			position: "fixed",
			zIndex: 40,
			top: 0,
			inset: 0,
			left: 0,
			right: 0,
			bottom: 0,
		},
	],
	"overlay",
	registry.dialog.parts.overlay,
);

/** The pane next to the sidebar. Holds the header and the body. */
export const main = style(
	{
		display: "flex",
		flex: 1,
		flexDirection: "column",
		minWidth: 0,
		minHeight: 0,
		backgroundColor: dialogThemeVars.mainBackground,
		"@media": {
			// The header moves above the sidebar, and the body fills the rest.
			[phone]: { display: "contents" },
		},
	},
	"main",
	registry.dialog.parts.main,
);

export const splitBody = style({}, "splitBody");
export const panelContent = style(
	[
		{
			padding: `${dialogThemeVars.contentPadding}`,
			overflow: "auto",
			selectors: {
				[`${positionerSelector}[data-panel-size=full] &`]: {
					flex: 1,
				},
				"[data-chrome=inset] &": {
					padding: 0,
					overflow: "visible",
				},
				[`.${main} > &`]: {
					display: "flex",
					flex: 1,
					flexDirection: "column",
					gap: tokens.space["6"],
					minHeight: 0,
					padding: `${tokens.space["2"]} ${tokens.space["6"]} ${tokens.space["6"]}`,
					overflowY: "auto",
					overscrollBehavior: "contain",
					scrollbarWidth: "thin",
				},
				[`&:is([data-layout=split], .${splitBody}:not([data-layout]))`]: {
					display: "grid",
					gridTemplateColumns: dialogThemeVars.splitColumns,
					gap: tokens.space["5"],
					alignItems: "start",
				},
			},
			"@media": {
				[phone]: {
					selectors: {
						[`&:is([data-layout=split], .${splitBody}:not([data-layout]))`]: {
							gridTemplateColumns: "minmax(0, 1fr)",
						},
						[`.${main} > &`]: {
							gap: tokens.space["5"],
							padding: `${tokens.space["4"]} ${tokens.space["3"]} calc(${tokens.space["4"]} + env(safe-area-inset-bottom, 0px))`,
							backgroundColor: dialogThemeVars.mainBackground,
						},
					},
				},
			},
		},
	],
	"panelContent",
	registry.dialog.parts.body,
);

export const panelFooter = style(
	{
		padding: `${dialogThemeVars.contentPadding}`,
		selectors: {
			[`${positionerSelector}[data-panel-size=full] &`]: {
				marginTop: "auto",
				marginBottom: "env(safe-area-inset-bottom, 20px)",
			},
			// The actions row: right-aligned buttons that wrap.
			"[data-chrome=inset] &": {
				display: "flex",
				flexWrap: "wrap",
				alignItems: "center",
				justifyContent: "flex-end",
				gap: tokens.space["2"],
				padding: 0,
			},
		},
		"@media": {
			[phone]: {
				selectors: {
					"[data-chrome=inset] &": { flexDirection: "column", alignItems: "stretch" },
				},
			},
		},
	},
	"panelFooter",
	registry.dialog.parts.footer,
);

/**
 * Centers the panel. The scrim is its `::before`, so it can fade in and out
 * with the panel. Keyboard opens and closes set `data-motion=none`.
 */
export const positioner = style(
	{
		position: "fixed",
		inset: 0,
		zIndex: 40,
		display: "flex",
		alignItems: "center",
		justifyContent: "center",
		padding: dialogThemeVars.gutter,
		"::before": {
			content: "",
			position: "absolute",
			inset: 0,
			zIndex: -1,
			backgroundColor: dialogThemeVars.overlayBackground,
			animation: `${fadeOut} ${tokens.motion.duration.fast} ${ease} forwards`,
		},
		selectors: {
			"&[data-panel-size=full]": {
				padding: 0,
			},
			"&[data-panel-size=export]": {
				vars: { [dialogThemeVars.gutter]: tokens.space["4"] },
			},
			"&:has(> [data-expanded])::before": {
				animation: `${fadeIn} ${tokens.motion.duration.panel} ${ease}`,
			},
			"&[data-motion=none]::before, &[data-motion=none]:has(> [data-expanded])::before": {
				animation: "none",
			},
		},
	},
	"positioner",
	registry.dialog.parts.positioner,
);

export const title = style(
	[
		{
			color: tokens.text.dialogTitle,
			height: dialogThemeVars.titleHeight,
			borderBottom: `${tokens.border.width} solid ${dialogThemeVars.dividerColor}`,
			padding: `0 ${dialogThemeVars.contentPadding}`,
			display: "flex",
			alignItems: "center",
			fontSize: dialogThemeVars.titleFontSize,
			fontWeight: tokens.font.weight.medium,
			justifyContent: "space-between",
			flexShrink: 0,
			selectors: {
				// No bar: the title sits in the panel padding, with no divider.
				"[data-chrome=inset] &": {
					height: "auto",
					minHeight: tokens.control.height.sm,
					gap: tokens.space["3"],
					padding: 0,
					borderBottom: "none",
					fontWeight: tokens.font.weight.semibold,
				},
				[`.${main} > &`]: {
					padding: `${tokens.space["3"]} ${tokens.space["3"]} ${tokens.space["2"]} ${tokens.space["6"]}`,
					fontSize: tokens.font.size.md,
				},
			},
			"@media": {
				[phone]: {
					selectors: {
						[`.${main} > &`]: {
							order: -1,
							padding: `${tokens.space["2"]} ${tokens.space["2"]} 0 ${tokens.space["4"]}`,
						},
					},
				},
			},
		},
	],
	"title",
	registry.dialog.parts.header,
);

export const panel = recipe(
	{
		base: [
			{
				display: "inline-flex",
				flexDirection: "column",
				width: "100%",
				maxHeight: "100%",
				padding: 0,
				overflow: "hidden",
				textAlign: "left",
				alignItems: "stretch",
				color: dialogThemeVars.contentTextColor,
				boxShadow: dialogThemeVars.contentBoxShadow,
				borderRadius: dialogThemeVars.panelRadius,
				backgroundColor: dialogThemeVars.contentBackground,
				transform: "translate(0, 0)",
				transformOrigin: "center",
				animation: `${contentHide} ${tokens.motion.duration.fast} ${ease}`,

				":focus-visible": {
					outline: "none",
				},
				selectors: {
					// In light mode the panel is white, so the sidebar takes the island grey
					// and the current item the white of the page.
					"[data-cui-theme=light] &": {
						vars: {
							[dialogThemeVars.sidebarBackground]: tokens.surface.canvas,
							[dialogThemeVars.navCurrentBackground]: tokens.surface.panel,
						},
					},
					"&[data-expanded]": {
						animation: `${contentShow} ${tokens.motion.duration.panel} ${ease}`,
					},
					[still]: { animation: "none" },
				},
				"@media": {
					[reducedMotion]: {
						animationName: fadeOut,
						selectors: {
							"&[data-expanded]": { animationName: fadeIn },
							[still]: { animation: "none" },
						},
					},
				},
			},
		],

		variants: {
			size: {
				[ComponentSizes.xs]: {
					width: "24rem",
				},
				[ComponentSizes.sm]: {
					width: "28rem",
				},
				[ComponentSizes.md]: {
					width: "32rem",
				},
				[ComponentSizes.lg]: responsiveStyle({
					md: {
						width: "48rem",
					},
				}),
				[ComponentSizes.xl]: responsiveStyle({
					md: {
						width: "48rem",
					},
					lg: {
						width: "64rem",
					},
				}),
				full: {
					padding: 0,
					margin: 0,
					minHeight: "100%",
					width: "100%",
					borderRadius: 0,
					height: "100%",
					":focus-visible": {
						boxShadow: "none",
						outline: "none",
					},
				},
				// Two panes: a sidebar and the section on screen. Fills a phone.
				settings: {
					vars: {
						[dialogThemeVars.width]: "62.5rem",
						[dialogThemeVars.height]: "42.5rem",
					},
					width: `min(${dialogThemeVars.width}, 100%)`,
					height: `min(${dialogThemeVars.height}, 100%)`,
					"@media": {
						[phone]: { height: "100%" },
					},
				},
				// A preview beside its options. The panel scrolls when it is taller than the viewport.
				export: {
					vars: { [dialogThemeVars.width]: "50rem" },
					width: `min(${dialogThemeVars.width}, 100%)`,
					overflowY: "auto",
					overscrollBehavior: "contain",
				},
			},
			chrome: {
				bar: {},
				inset: {
					vars: { [dialogThemeVars.panelRadius]: tokens.radius.dialog },
					gap: tokens.space["5"],
					padding: tokens.space["5"],
					"@media": {
						[phone]: {
							gap: tokens.space["4"],
							padding: tokens.space["4"],
							selectors: {
								[`&:has(> [data-cui=${registry.dialog.parts.sidebar}])`]: {
									flexDirection: "column",
								},
							},
						},
					},
					selectors: {
						// With a sidebar the panes reach the edges and hold their own padding.
						[`&:has(> [data-cui=${registry.dialog.parts.sidebar}])`]: {
							flexDirection: "row",
							gap: 0,
							padding: 0,
						},
					},
				},
			},
		},
		compoundVariants: [
			// The settings panes reach the edges, so the panel keeps the 14px corners
			// of CodeImage's settings dialog.
			{
				variants: { size: "settings", chrome: "inset" },
				style: { vars: { [dialogThemeVars.panelRadius]: tokens.radius.lg } },
			},
		],
	},
	"panel",
	registry.dialog.parts.panel,
);

export type DialogPanelVariants = RecipeVariants<typeof panel>;

export const description = style(
	{
		color: dialogThemeVars.contentTextColor,
		padding: `${dialogThemeVars.contentPadding} ${dialogThemeVars.contentPadding} 0`,
		selectors: {
			"[data-chrome=inset] &": { padding: 0 },
		},
	},
	"description",
	registry.dialog.parts.description,
);

/* Settings layout */

export const sidebar = style(
	{
		display: "flex",
		flex: "none",
		flexDirection: "column",
		width: "232px",
		minHeight: 0,
		backgroundColor: dialogThemeVars.sidebarBackground,
		"@media": {
			[phone]: { width: "auto" },
		},
	},
	"sidebar",
	registry.dialog.parts.sidebar,
);

export const sidebarSearch = style(
	{
		padding: `${tokens.space["3"]} ${tokens.space["3"]} ${tokens.space["2"]}`,
		"@media": {
			[phone]: {
				padding: `${tokens.space["2"]} ${tokens.space["2"]} ${tokens.space["2"]}`,
			},
		},
	},
	"sidebarSearch",
	registry.dialog.parts.sidebarSearch,
);

export const nav = style(
	{
		minHeight: 0,
		overflowY: "auto",
		padding: `${tokens.space["1"]} ${tokens.space["3"]} ${tokens.space["3"]}`,
		"@media": {
			[phone]: { padding: `0 ${tokens.space["2"]} ${tokens.space["2"]}` },
		},
	},
	"nav",
	registry.dialog.parts.nav,
);

export const navList = style(
	{
		display: "flex",
		flexDirection: "column",
		gap: tokens.space["0.5"],
		margin: 0,
		padding: 0,
		listStyle: "none",
		"@media": {
			// Labels are wider than a phone, so they wrap into rows of three.
			[phone]: {
				display: "grid",
				gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
				gap: tokens.space["1"],
			},
		},
	},
	"navList",
	registry.dialog.parts.nav + " > ul",
);

export const navItem = style(
	{
		display: "flex",
		alignItems: "center",
		gap: tokens.space["2.5"],
		width: "100%",
		height: tokens.control.height.sm,
		padding: `0 ${tokens.space["2.5"]}`,
		border: 0,
		borderRadius: tokens.radius.nav,
		background: "transparent",
		color: tokens.text.muted,
		font: "inherit",
		fontSize: tokens.font.size.sm,
		fontWeight: tokens.font.weight.medium,
		textAlign: "left",
		cursor: "pointer",
		transition: [
			`background-color ${tokens.motion.duration.fast} ${ease}`,
			`color ${tokens.motion.duration.fast} ${ease}`,
			`transform ${tokens.motion.duration.fast} ${ease}`,
		].join(", "),
		selectors: {
			"&:active": { transform: "scale(0.98)" },
			"&:focus-visible": focusRing,
			"&[aria-current]": {
				backgroundColor: dialogThemeVars.navCurrentBackground,
				color: tokens.text.default,
			},
			"&:disabled": { opacity: 0.5, cursor: "default" },
		},
		"@media": {
			[finePointer]: {
				selectors: {
					"&:hover:not([aria-current]):not(:disabled)": { color: tokens.text.default },
				},
			},
			[reducedMotion]: {
				transition: "none",
				selectors: { "&:active": { transform: "none" } },
			},
			[phone]: {
				justifyContent: "center",
				height: tokens.control.height.md,
				padding: `0 ${tokens.space["1"]}`,
				whiteSpace: "nowrap",
			},
		},
	},
	"navItem",
	registry.dialog.parts.navItem,
);

export const navIcon = style(
	{
		display: "flex",
		flex: "none",
		"@media": {
			[phone]: { display: "none" },
		},
	},
	"navIcon",
	registry.dialog.parts.navIcon,
);

/* Sections: a group of rows, or a well */

export const section = recipe(
	{
		base: {
			display: "flex",
			flex: "none",
			flexDirection: "column",
			gap: tokens.space["2"],
			minWidth: 0,
			margin: 0,
		},
		variants: {
			variant: {
				// A title over one island of rows. Rows touch; space sets them apart.
				group: {},
				// The section is the island: a preview, or a block of actions.
				well: {
					padding: tokens.space["3"],
					borderRadius: tokens.radius.card,
					backgroundColor: dialogThemeVars.islandBackground,
				},
			},
		},
		defaultVariants: { variant: "group" },
	},
	"section",
	registry.dialog.parts.section,
);

export const sectionTitle = style(
	{
		margin: 0,
		padding: `0 ${tokens.space["1"]}`,
		color: tokens.text.dialogTitle,
		fontSize: tokens.font.size.md,
		fontWeight: tokens.font.weight.semibold,
		lineHeight: 1.3,
		selectors: {
			"[data-variant=well] > &": {
				padding: `0 ${tokens.space["2"]}`,
				color: tokens.text.muted,
				fontSize: tokens.font.size.xs,
				fontWeight: tokens.font.weight.medium,
			},
		},
	},
	"sectionTitle",
	registry.dialog.parts.sectionTitle,
);

export const sectionContent = style(
	{
		display: "flex",
		flexDirection: "column",
		minWidth: 0,
		selectors: {
			"[data-variant=group] > &": {
				padding: `${tokens.space["1.5"]} 0`,
				borderRadius: tokens.radius.card,
				backgroundColor: dialogThemeVars.islandBackground,
			},
			[`${sectionSelector}[data-columns='2'] > &`]: {
				display: "grid",
				gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
				gap: tokens.space["0.5"],
			},
		},
		"@media": {
			[phone]: {
				selectors: {
					[`${sectionSelector}[data-columns='2'] > &`]: {
						gridTemplateColumns: "minmax(0, 1fr)",
					},
				},
			},
		},
	},
	"sectionContent",
	registry.dialog.parts.sectionContent,
);

finish();
