import { createPolymorphicComponent } from "@kobalte/utils";

import { FormControlLabel } from "@kobalte/core";

/**
 * The label that gives the user information on the radio group.
 */
export const SegmentedFieldLabel = createPolymorphicComponent<"span">(props => {
	return <FormControlLabel as="span" {...props} />;
});
