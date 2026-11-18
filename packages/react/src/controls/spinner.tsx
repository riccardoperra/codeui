import {
	spinnerParts,
	spinnerStyleProps,
	spinnerStyles,
	type SpinnerClasses,
	type SpinnerVariants,
} from "@codeui/styles/spinner";
import type { ComponentProps } from "react";
import { classes } from "../classes";

export type SpinnerProps = Omit<ComponentProps<"svg">, "children"> &
	SpinnerVariants & {
		/**
		 * Accessible name. With a label the spinner is a status region. Without one it is hidden, for
		 * use inside a control that already announces its busy state.
		 */
		label?: string;
		/** Classes for the parts this component renders, keyed by part name. */
		classes?: SpinnerClasses;
	};

export function Spinner({
	size,
	label,
	classes: parts,
	className,
	...props
}: SpinnerProps) {
	const { class: root, ...appearance } = spinnerStyleProps({ size });
	return (
		<svg
			viewBox="0 0 24 24"
			fill="none"
			role={label ? "status" : undefined}
			aria-label={label}
			aria-hidden={label ? undefined : true}
			{...appearance}
			{...props}
			className={classes(root, parts?.root, className)}
		>
			<circle
				cx="12"
				cy="12"
				r="9"
				strokeWidth="3"
				data-cui={spinnerParts.track}
				className={classes(spinnerStyles.track(), parts?.track)}
			/>
			<path
				d="M12 3a9 9 0 0 1 9 9"
				strokeWidth="3"
				data-cui={spinnerParts.indicator}
				className={classes(spinnerStyles.indicator(), parts?.indicator)}
			/>
		</svg>
	);
}
