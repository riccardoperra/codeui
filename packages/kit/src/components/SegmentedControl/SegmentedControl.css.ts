import { createTheme, recipe, style } from "../../foundation/layer.css";
import { tokens } from "../../foundation/cui.css";
import { transition } from "../../foundation/motion.css";
import { RecipeVariants } from "@vanilla-extract/recipes";
import { mapSizeValue } from "../../foundation/sizes";
import { componentStateStyles } from "@kobalte/vanilla-extract";

export const [segmentedFieldTheme, segmentedFieldVars] = createTheme({
	activeSegmentedBackgroundColor: tokens.surface.inputAccent,
	segmentedTextColor: tokens.text.default,
	activeSegmentedTextColor: tokens.action.neutral.text,
	segmentWrapperSolidBackground: tokens.surface.input,
	segmentWrapperBorderedColor: tokens.border.menu,
	segmentWrapperRadius: tokens.radius.md,
	segmentWrapperPadding: tokens.space["1"],
	segmentHeight: "",
	segmentPadding: "",
	segmentRadius: tokens.radius.sm,
	segmentFontSize: tokens.font.size.sm,
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
	defaultVariants: { size: "md" },
	variants: {
		theme: {
			neutral: {
				vars: {},
			},
			primary: {
				vars: {
					[segmentedFieldVars.activeSegmentedBackgroundColor]: tokens.action.brand.base,
					[segmentedFieldVars.activeSegmentedTextColor]: tokens.action.brand.text,
				},
			},
		},
		variant: {
			solid: {
				backgroundColor: segmentedFieldVars.segmentWrapperSolidBackground,
			},
			bordered: {
				backgroundColor: "transparent",
				boxShadow: `0 0 0 ${tokens.border.widthStrong} ${segmentedFieldVars.segmentWrapperBorderedColor}`,
			},
		},
		size: {
			[SegmentedControlSizes.xl]: {
				vars: {
					[segmentedFieldVars.segmentWrapperPadding]: `calc(${tokens.space["1"]} * 1.5)`,
					[segmentedFieldVars.segmentHeight]: mapSizeValue("xl"),
					[segmentedFieldVars.segmentFontSize]: tokens.font.size.lg,
					[segmentedFieldVars.segmentPadding]: tokens.space["6"],
					[segmentedFieldVars.segmentRadius]: tokens.radius.lg,
					[segmentedFieldVars.segmentWrapperRadius]: tokens.radius.xl,
				},
			},
			[SegmentedControlSizes.lg]: {
				vars: {
					[segmentedFieldVars.segmentWrapperPadding]: tokens.space["1"],
					[segmentedFieldVars.segmentHeight]: mapSizeValue("lg"),
					[segmentedFieldVars.segmentFontSize]: tokens.font.size.md,
					[segmentedFieldVars.segmentPadding]: tokens.space["5"],
					[segmentedFieldVars.segmentRadius]: tokens.radius.sm,
					[segmentedFieldVars.segmentWrapperRadius]: tokens.radius.md,
				},
			},
			[SegmentedControlSizes.md]: {
				vars: {
					[segmentedFieldVars.segmentWrapperPadding]: tokens.space["1"],
					[segmentedFieldVars.segmentHeight]: mapSizeValue("md"),
					[segmentedFieldVars.segmentFontSize]: tokens.font.size.md,
					[segmentedFieldVars.segmentPadding]: tokens.space["4"],
					[segmentedFieldVars.segmentRadius]: tokens.radius.sm,
					[segmentedFieldVars.segmentWrapperRadius]: tokens.radius.md,
				},
			},
			[SegmentedControlSizes.sm]: {
				vars: {
					[segmentedFieldVars.segmentWrapperPadding]: tokens.space["1"],
					[segmentedFieldVars.segmentHeight]: mapSizeValue("sm"),
					[segmentedFieldVars.segmentFontSize]: tokens.font.size.sm,
					[segmentedFieldVars.segmentPadding]: tokens.space["3"],
					[segmentedFieldVars.segmentRadius]: tokens.radius.xs,
					[segmentedFieldVars.segmentWrapperRadius]: tokens.radius.sm,
				},
			},
			[SegmentedControlSizes.xs]: {
				vars: {
					[segmentedFieldVars.segmentWrapperPadding]: `calc(${tokens.space["1"]} - 1px)`,
					[segmentedFieldVars.segmentHeight]: mapSizeValue("xs"),
					[segmentedFieldVars.segmentFontSize]: `calc(${tokens.font.size.xs} - 1px)`,
					[segmentedFieldVars.segmentPadding]: tokens.space["2"],
					[segmentedFieldVars.segmentRadius]: tokens.radius.xs,
					[segmentedFieldVars.segmentWrapperRadius]: tokens.radius.sm,
				},
			},
		},
		fluid: {
			true: {
				width: "100%",
			},
		},
		pill: {
			true: {
				vars: {
					[segmentedFieldVars.segmentRadius]: tokens.radius.full,
					[segmentedFieldVars.segmentWrapperRadius]: tokens.radius.full,
				},
			},
		},
	},
});

export const list = style({
	display: "flex",
	gap: tokens.space["1"],
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
		zIndex: 1,
		fontWeight: tokens.font.weight.medium,
		borderRadius: segmentedFieldVars.segmentRadius,
		gap: tokens.space["2"],
		transition: transition(["opacity", "background-color", "color"]),
		cursor: "pointer",
		selectors: {
			"&[data-selected]": {
				color: segmentedFieldVars.activeSegmentedTextColor,
			},
			[`${segmentedFieldTheme}[data-autoWidth] &`]: {
				width: "1px",
				flexGrow: 1,
				padding: 0,
			},
		},
		":focus-visible": {
			outlineOffset: tokens.focus.offset,
			outline: `${tokens.focus.width} solid ${tokens.focus.color}`,
		},
	},
	componentStateStyles({
		disabled: {
			opacity: 0.2,
			cursor: "not-allowed",
		},
	}),
]);

export const indicator = style({
	position: "absolute",
	height: "100%",
	transition: transition(["width", "transform"], tokens.motion.duration.normal),
	backgroundColor: segmentedFieldVars.activeSegmentedBackgroundColor,
	content: "",
	boxShadow: tokens.shadow.sm,
	borderRadius: segmentedFieldVars.segmentRadius,
});
