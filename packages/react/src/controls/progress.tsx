"use client";

import {
	progressParts,
	progressStyleProps,
	progressStyles,
	type ProgressClasses,
	type ProgressVariants,
} from "@codeui/styles/progress";
import type { ComponentProps, CSSProperties, ReactNode } from "react";
import { Label, ProgressBar, composeRenderProps } from "react-aria-components";
import { classes } from "../classes";
import { flag } from "./utils";

export type { ProgressClasses };

export type ProgressProps = Omit<ComponentProps<typeof ProgressBar>, "children"> &
	ProgressVariants & {
		label?: ReactNode;
		/** Shows the formatted value beside the label. */
		showValue?: boolean;
		/** Classes for the parts this component renders, keyed by part name. */
		classes?: ProgressClasses;
	};

/** React Aria's ProgressBar. Without a `value` set `isIndeterminate`. */
export function Progress({
	size,
	label,
	showValue,
	classes: parts,
	className,
	...props
}: ProgressProps) {
	const { class: root, ...rootAttributes } = progressStyleProps.root({ size });
	const { class: track, ...trackAttributes } = progressStyleProps.track({ size });
	return (
		<ProgressBar
			{...rootAttributes}
			{...props}
			className={composeRenderProps(className, className =>
				classes(root, parts?.root, className),
			)}
		>
			{({ percentage, valueText, isIndeterminate }) => (
				<>
					{label ? (
						<Label
							elementType="span"
							data-cui={progressParts.label}
							className={classes(progressStyles.label(), parts?.label)}
						>
							{label}
						</Label>
					) : null}
					{showValue && !isIndeterminate ? (
						<span
							data-cui={progressParts.valueLabel}
							className={classes(progressStyles.valueLabel(), parts?.valueLabel)}
						>
							{valueText}
						</span>
					) : null}
					<div {...trackAttributes} className={classes(track, parts?.track)}>
						<div
							data-cui={progressParts.fill}
							data-indeterminate={flag(isIndeterminate)}
							className={classes(progressStyles.fill(), parts?.fill)}
							style={
								{ "--cui-progress-fill-width": `${percentage ?? 0}%` } as CSSProperties
							}
						/>
					</div>
				</>
			)}
		</ProgressBar>
	);
}
