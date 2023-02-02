import { createPolymorphicComponent, mergeDefaultProps } from "@kobalte/utils";
import { splitProps } from "solid-js";
import { Dynamic } from "solid-js/web";

import { useSegmentedFieldItemContext } from "./SegmentedFieldItemContext";

/**
 * The element that visually represents a radio button.
 */
export const SegmentedFieldItemControl = createPolymorphicComponent<"div">(props => {
	const context = useSegmentedFieldItemContext();

	props = mergeDefaultProps(
		{
			as: "div",
			id: context.generateId("control"),
		},
		props,
	);

	const [local, others] = splitProps(props, ["as"]);

	return <Dynamic component={local.as} {...context.dataset()} {...others} />;
});
