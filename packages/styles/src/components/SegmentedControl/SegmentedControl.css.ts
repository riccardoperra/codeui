import type { RecipeVariants } from "../../types";
import { recipe } from "../../recipe";
export const indicator: string = "cui-segmented-control-indicator";
export const list: string = "cui-segmented-control-list";
export const segment: string = "cui-segmented-control-segment";
export const segmentedControlWrapper = recipe({
	defaultClassName:
		"cui-segmented-control-segmentedControlWrapper cui-segmented-control-segmentedFieldTheme",
	variantClassNames: {
		theme: {
			neutral: "cui-segmented-control-segmentedControlWrapper_theme_neutral",
			primary: "cui-segmented-control-segmentedControlWrapper_theme_primary",
		},
		variant: {
			solid: "cui-segmented-control-segmentedControlWrapper_variant_solid",
			bordered: "cui-segmented-control-segmentedControlWrapper_variant_bordered",
		},
		size: {
			xl: "cui-segmented-control-segmentedControlWrapper_size_xl",
			lg: "cui-segmented-control-segmentedControlWrapper_size_lg",
			md: "cui-segmented-control-segmentedControlWrapper_size_md",
			sm: "cui-segmented-control-segmentedControlWrapper_size_sm",
			xs: "cui-segmented-control-segmentedControlWrapper_size_xs",
		},
		fluid: { true: "cui-segmented-control-segmentedControlWrapper_fluid_true" },
		pill: { true: "cui-segmented-control-segmentedControlWrapper_pill_true" },
	},
	defaultVariants: { size: "md" },
	compoundVariants: [],
});
export const segmentedFieldTheme: string = "cui-segmented-control-segmentedFieldTheme";
export const segmentedFieldVars = {
	activeSegmentedBackgroundColor:
		"var(--cui-segmentedFieldTheme-activeSegmentedBackgroundColor)" as `var(--${string})`,
	segmentedTextColor:
		"var(--cui-segmentedFieldTheme-segmentedTextColor)" as `var(--${string})`,
	activeSegmentedTextColor:
		"var(--cui-segmentedFieldTheme-activeSegmentedTextColor)" as `var(--${string})`,
	segmentWrapperSolidBackground:
		"var(--cui-segmentedFieldTheme-segmentWrapperSolidBackground)" as `var(--${string})`,
	segmentWrapperBorderedColor:
		"var(--cui-segmentedFieldTheme-segmentWrapperBorderedColor)" as `var(--${string})`,
	segmentWrapperRadius:
		"var(--cui-segmentedFieldTheme-segmentWrapperRadius)" as `var(--${string})`,
	segmentWrapperPadding:
		"var(--cui-segmentedFieldTheme-segmentWrapperPadding)" as `var(--${string})`,
	segmentHeight: "var(--cui-segmentedFieldTheme-segmentHeight)" as `var(--${string})`,
	segmentPadding: "var(--cui-segmentedFieldTheme-segmentPadding)" as `var(--${string})`,
	segmentRadius: "var(--cui-segmentedFieldTheme-segmentRadius)" as `var(--${string})`,
	segmentFontSize: "var(--cui-segmentedFieldTheme-segmentFontSize)" as `var(--${string})`,
};

export type SegmentedControlVariants = RecipeVariants<typeof segmentedControlWrapper>;
