import { mergeDefaultProps, OverrideComponentProps } from "@kobalte/utils";
import { splitProps } from "solid-js";

import { useSegmentedFieldItemContext } from "./SegmentedFieldItemContext";
import { AsChildProp, Polymorphic } from "@kobalte/core";

/**
 * The label that gives the user information on the radio button.
 */
interface SegmentedFieldItemLabelProps
	extends OverrideComponentProps<"span", AsChildProp> {}

export function SegmentedFieldItemLabel(props: SegmentedFieldItemLabelProps) {
	const context = useSegmentedFieldItemContext();

	props = mergeDefaultProps(
		{
			id: context.generateId("label"),
		},
		props,
	);

	return <Polymorphic fallback={"span"} {...context.dataset()} {...props} />;
}
