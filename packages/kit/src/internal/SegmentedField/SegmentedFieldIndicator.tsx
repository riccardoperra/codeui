import { OverrideComponentProps } from "@kobalte/utils";
import { AsChildProp, Polymorphic } from "@kobalte/core";

/**
 * The visual indicator rendered when the radio item is in a checked state.
 * You can style this element directly, or you can use it as a wrapper to put an icon into, or both.
 */
export interface SegmentedFieldIndicators
	extends OverrideComponentProps<"div", AsChildProp> {}

export function SegmentedFieldIndicator(props: SegmentedFieldIndicators) {
	return <Polymorphic fallback={"div"} {...props} />;
}
