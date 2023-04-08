import { As, FormControlLabel } from "@kobalte/core";
import { OverrideComponentProps } from "@kobalte/utils";

/**
 * The label that gives the user information on the radio group.
 */
export function SegmentedFieldLabel(props: OverrideComponentProps<"span", {}>) {
	return (
		<FormControlLabel asChild>
			<As component={"span"} {...props} />
		</FormControlLabel>
	);
}
