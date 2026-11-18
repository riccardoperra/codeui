import { type BaseComponentSize } from "../../foundation/sizes";

export const indicator: string = "cui-segmented-control-indicator";
export const list: string = "cui-segmented-control-list";
export const segment: string = "cui-segmented-control-segment";
export const segmentedControlWrapper = (): string =>
	"cui-segmented-control-segmentedControlWrapper cui-segmented-control-segmentedFieldTheme";
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

export type SegmentedControlVariants =
	| {
			theme?: "neutral" | "primary";
			variant?: "solid" | "bordered";
			size?: BaseComponentSize;
			fluid?: boolean;
			pill?: boolean;
	  }
	| undefined;
