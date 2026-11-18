import {
	alertParts,
	alertStyleProps,
	alertStyles,
	type AlertClasses,
	type AlertVariants,
} from "@codeui/styles/alert";
import type { ComponentProps, ReactNode } from "react";
import { classes } from "../classes";
import { ToneIcon } from "./icons";

export type AlertProps = Omit<ComponentProps<"div">, "title"> &
	AlertVariants & {
		title?: ReactNode;
		/** The message. Falls back to `children`. */
		description?: ReactNode;
		/** Replaces the tone icon. Shown only with `showIcon`. */
		icon?: ReactNode;
		/** Shows `icon`, or the tone icon for a status tone. Neutral has no tone icon. */
		showIcon?: boolean;
		action?: ReactNode;
		/** Classes for the parts this component renders, keyed by part name. */
		classes?: AlertClasses;
	};

/** A message that the screen reader announces when it appears. Use Text for static hints. */
export function Alert({
	tone,
	fluid,
	title,
	description,
	icon,
	showIcon,
	action,
	classes: parts,
	className,
	children,
	...props
}: AlertProps) {
	const { class: root, ...appearance } = alertStyleProps({ tone, fluid });
	const shownIcon = showIcon
		? (icon ?? ((tone ?? "neutral") !== "neutral" ? <ToneIcon tone={tone} /> : null))
		: null;

	return (
		<div
			role="alert"
			{...appearance}
			{...props}
			className={classes(root, parts?.root, className)}
		>
			{shownIcon ? (
				<span
					aria-hidden="true"
					data-cui={alertParts.icon}
					className={classes(alertStyles.icon(), parts?.icon)}
				>
					{shownIcon}
				</span>
			) : null}
			{title ? (
				<div
					data-cui={alertParts.title}
					className={classes(alertStyles.title(), parts?.title)}
				>
					{title}
				</div>
			) : null}
			<div
				data-cui={alertParts.description}
				className={classes(alertStyles.description(), parts?.description)}
			>
				{description ?? children}
			</div>
			{action ? (
				<div
					data-cui={alertParts.action}
					className={classes(alertStyles.action(), parts?.action)}
				>
					{action}
				</div>
			) : null}
		</div>
	);
}
