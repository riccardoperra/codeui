import { createTheme, style } from "@vanilla-extract/css";
import { themeTokens, themeVars } from "../../foundation";
import { recipe, RecipeVariants } from "@vanilla-extract/recipes";
import { mapSizeValue } from "../../foundation/sizes";
import { componentStateStyles } from "@kobalte/vanilla-extract";

export const [segmentedFieldTheme, segmentedFieldVars] = createTheme({
	// TODO fix this
	activeSegmentedBackgroundColor: themeVars.brandSecondaryAccentHover,
	segmentedTextColor: themeVars.foreground,
	activeSegmentedTextColor: themeVars.foreground,
	segmentWrapperSolidBackground: themeVars.formAccent,
	segmentWrapperBorderedColor: themeVars.formAccentBorder,
	segmentWrapperRadius: themeTokens.radii.md,
	segmentWrapperPadding: themeTokens.spacing["1"],
	segmentHeight: "",
	segmentPadding: "",
	segmentRadius: themeTokens.radii.sm,
	segmentFontSize: themeTokens.fontSize.sm,
});

const SegmentedControlSizes = {
	xs: "xs",
	sm: "sm",
	md: "md",
	lg: "lg",
	xl: "xl",
} as const;

export const segmentedControlWrapper = recipe({
	base: [
		segmentedFieldTheme,
		{
			display: "inline-flex",
			padding: segmentedFieldVars.segmentWrapperPadding,
			height: segmentedFieldVars.segmentHeight,
			position: "relative",
			overflow: "visible",
			cursor: "default",
			textAlign: "center",
			userSelect: "none",
			borderRadius: segmentedFieldVars.segmentWrapperRadius,
		},
		componentStateStyles({
			disabled: {
				opacity: 0.5,
			},
		}),
	],
	variants: {
		theme: {
			neutral: {
				vars: {},
			},
			primary: {
				vars: {
					[segmentedFieldVars.activeSegmentedBackgroundColor]: themeVars.brand,
					[segmentedFieldVars.activeSegmentedTextColor]: themeTokens.colors.gray12,
				},
			},
		},
		variant: {
			solid: {
				backgroundColor: segmentedFieldVars.segmentWrapperSolidBackground,
			},
			bordered: {
				backgroundColor: "transparent",
				boxShadow: `0 0 0 2px ${segmentedFieldVars.segmentWrapperBorderedColor}`,
			},
		},
		size: {
			[SegmentedControlSizes.xl]: {
				vars: {
					[segmentedFieldVars.segmentWrapperPadding]: `calc(${themeTokens.spacing["1"]} * 1.5)`,
					[segmentedFieldVars.segmentHeight]: mapSizeValue("xl"),
					[segmentedFieldVars.segmentFontSize]: themeTokens.fontSize.lg,
					[segmentedFieldVars.segmentPadding]: themeTokens.spacing["6"],
					[segmentedFieldVars.segmentRadius]: themeTokens.radii.lg,
					[segmentedFieldVars.segmentWrapperRadius]: themeTokens.radii.xl,
				},
			},
			[SegmentedControlSizes.lg]: {
				vars: {
					[segmentedFieldVars.segmentWrapperPadding]: themeTokens.spacing["1"],
					[segmentedFieldVars.segmentHeight]: mapSizeValue("lg"),
					[segmentedFieldVars.segmentFontSize]: themeTokens.fontSize.md,
					[segmentedFieldVars.segmentPadding]: themeTokens.spacing["5"],
					[segmentedFieldVars.segmentRadius]: themeTokens.radii.sm,
					[segmentedFieldVars.segmentWrapperRadius]: themeTokens.radii.md,
				},
			},
			[SegmentedControlSizes.md]: {
				vars: {
					[segmentedFieldVars.segmentWrapperPadding]: themeTokens.spacing["1"],
					[segmentedFieldVars.segmentHeight]: mapSizeValue("md"),
					[segmentedFieldVars.segmentFontSize]: themeTokens.fontSize.md,
					[segmentedFieldVars.segmentPadding]: themeTokens.spacing["4"],
					[segmentedFieldVars.segmentRadius]: themeTokens.radii.sm,
					[segmentedFieldVars.segmentWrapperRadius]: themeTokens.radii.md,
				},
			},
			[SegmentedControlSizes.sm]: {
				vars: {
					[segmentedFieldVars.segmentWrapperPadding]: themeTokens.spacing["1"],
					[segmentedFieldVars.segmentHeight]: mapSizeValue("sm"),
					[segmentedFieldVars.segmentFontSize]: themeTokens.fontSize.sm,
					[segmentedFieldVars.segmentPadding]: themeTokens.spacing["3"],
					[segmentedFieldVars.segmentRadius]: themeTokens.radii.xs,
					[segmentedFieldVars.segmentWrapperRadius]: themeTokens.radii.sm,
				},
			},
			[SegmentedControlSizes.xs]: {
				vars: {
					[segmentedFieldVars.segmentWrapperPadding]: `calc(${themeTokens.spacing["1"]} - 1px)`,
					[segmentedFieldVars.segmentHeight]: mapSizeValue("xs"),
					[segmentedFieldVars.segmentFontSize]: `calc(${themeTokens.fontSize.xs} - 1px)`,
					[segmentedFieldVars.segmentPadding]: themeTokens.spacing["2"],
					[segmentedFieldVars.segmentRadius]: themeTokens.radii.xs,
					[segmentedFieldVars.segmentWrapperRadius]: themeTokens.radii.sm,
				},
			},
		},
		fluid: {
			true: {
				width: "100%",
				vars: {
					[segmentedFieldVars.segmentHeight]: "100%",
				},
			},
		},
		pill: {
			true: {
				vars: {
					[segmentedFieldVars.segmentRadius]: themeTokens.radii.full,
					[segmentedFieldVars.segmentWrapperRadius]: themeTokens.radii.full,
				},
			},
		},
	},
});

export const list = style({
	display: "flex",
	gap: themeTokens.spacing["1"],
	position: "relative",
	flex: 1,
	flexWrap: "nowrap",
	flexShrink: 0,
	alignItems: "center",
});

export type SegmentedControlVariants = RecipeVariants<typeof segmentedControlWrapper>;

export const segment = style([
	{
		appearance: "none",
		border: 0,
		backgroundColor: "transparent",
		width: "100%",
		height: "100%",
		position: "relative",
		display: "flex",
		alignItems: "center",
		justifyContent: "center",
		whiteSpace: "nowrap",
		flexGrow: 1,
		fontSize: segmentedFieldVars.segmentFontSize,
		padding: `0 ${segmentedFieldVars.segmentPadding}`,
		color: segmentedFieldVars.segmentedTextColor,
		opacity: 0.8,
		zIndex: 1,
		fontWeight: themeTokens.fontWeight.medium,
		borderRadius: segmentedFieldVars.segmentRadius,
		gap: themeTokens.spacing["2"],
		transition:
			"opacity .2s, background-color .2s, transform .2s, outline-color 150ms ease-in-out, outline-offset 150ms ease-in",
		outlineColor: `transparent`,
		outlineOffset: "0px",
		cursor: "pointer",
		selectors: {
			"&[data-selected]": {
				opacity: 1,
				color: segmentedFieldVars.activeSegmentedTextColor,
			},
			[`${segmentedFieldTheme}[data-autoWidth] &`]: {
				width: "1px",
				flexGrow: 1,
				padding: 0,
			},
		},
		":focus-visible": {
			outlineOffset: "2px",
			outline: `2px solid ${themeVars.brand}`,
		},
	},
	componentStateStyles({
		disabled: {
			opacity: 0.2,
			cursor: "not-allowed",
		},
	}),
]);

export const indicator = style([
	{
		position: "absolute",
		height: "100%",
		transition:
			"width 250ms cubic-bezier(.2, 0, 0, 1), transform 250ms cubic-bezier(.2, 0, 0, 1)",
		backgroundColor: segmentedFieldVars.activeSegmentedBackgroundColor,
		content: "",
		boxShadow: themeTokens.boxShadow.default,
		borderRadius: segmentedFieldVars.segmentRadius,
	},
]);
