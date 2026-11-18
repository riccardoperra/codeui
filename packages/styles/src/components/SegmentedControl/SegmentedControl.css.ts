import type { SegmentedControlStyleOptions } from "../../generated-appearance/segmentedcontrol";
export const indicator: string = "cui-segmentedcontrol-indicator";
export const list: string = "cui-segmentedcontrol-list";
export const segment: string = "cui-segmentedcontrol-segment";
export const segmentedControlWrapper = (): string =>
	"cui-segmentedcontrol";
export const segmentedFieldVars = {
	activeSegmentedBackgroundColor:
		"var(--cui-segmentedcontrol-active-segmented-background-color)" as `var(--${string})`,
	segmentedTextColor:
		"var(--cui-segmentedcontrol-segmented-text-color)" as `var(--${string})`,
	activeSegmentedTextColor:
		"var(--cui-segmentedcontrol-active-segmented-text-color)" as `var(--${string})`,
	segmentWrapperSolidBackground:
		"var(--cui-segmentedcontrol-segment-wrapper-solid-background)" as `var(--${string})`,
	segmentWrapperBorderedColor:
		"var(--cui-segmentedcontrol-segment-wrapper-bordered-color)" as `var(--${string})`,
	segmentWrapperRadius:
		"var(--cui-segmentedcontrol-segment-wrapper-radius)" as `var(--${string})`,
	segmentWrapperPadding:
		"var(--cui-segmentedcontrol-segment-wrapper-padding)" as `var(--${string})`,
	segmentHeight: "var(--cui-segmentedcontrol-segment-height)" as `var(--${string})`,
	segmentPadding: "var(--cui-segmentedcontrol-segment-padding)" as `var(--${string})`,
	segmentRadius: "var(--cui-segmentedcontrol-segment-radius)" as `var(--${string})`,
	segmentFontSize: "var(--cui-segmentedcontrol-segment-font-size)" as `var(--${string})`,
};

export type SegmentedControlVariants =
	| Omit<SegmentedControlStyleOptions, "class" | "autoWidth">
	| undefined;
