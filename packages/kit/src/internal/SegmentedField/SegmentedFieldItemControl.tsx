import { mergeDefaultProps, OverrideComponentProps } from "@kobalte/utils";

import { useSegmentedFieldItemContext } from "./SegmentedFieldItemContext";
import { AsChildProp, Polymorphic } from "@kobalte/core";

interface SegmentedFieldItemControlProps
	extends OverrideComponentProps<"div", AsChildProp> {}

/**
 * The element that visually represents a radio button.
 */
export function SegmentedFieldItemControl(props: SegmentedFieldItemControlProps) {
	const context = useSegmentedFieldItemContext();

	props = mergeDefaultProps(
		{
			id: context.generateId("control"),
		},
		props,
	);

	return <Polymorphic fallback={"div"} {...context.dataset()} {...props} />;
}
