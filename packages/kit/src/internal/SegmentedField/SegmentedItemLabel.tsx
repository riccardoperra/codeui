import { createPolymorphicComponent, mergeDefaultProps } from "@kobalte/utils";
import { splitProps } from "solid-js";
import { Dynamic } from "solid-js/web";

import { useSegmentedFieldItemContext } from "./SegmentedFieldItemContext";

/**
 * The label that gives the user information on the radio button.
 */
export const SegmentedFieldItemLabel = createPolymorphicComponent<"span">(props => {
	const context = useSegmentedFieldItemContext();

	props = mergeDefaultProps(
		{
			as: "span",
			id: context.generateId("label"),
		},
		props,
	);

	const [local, others] = splitProps(props, ["as"]);

	return <Dynamic component={local.as} {...context.dataset()} {...others} />;
});
