import { createPolymorphicComponent } from "@kobalte/utils";
import { splitProps } from "solid-js";
import { Dynamic } from "solid-js/web";

/**
 * The visual indicator rendered when the radio item is in a checked state.
 * You can style this element directly, or you can use it as a wrapper to put an icon into, or both.
 */
export const SegmentedFieldIndicator = createPolymorphicComponent<"div", {}>(props => {
	const [local, others] = splitProps(props, ["as", "ref"]);

	return <Dynamic component={local.as} ref={local.ref} {...others} />;
});
