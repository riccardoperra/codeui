import {
	badgeParts,
	badgeStyleProps,
	badgeStyles,
	type BadgeClasses,
	type BadgeVariants,
} from "@codeui/styles/badge";
import type { ComponentProps, ReactNode } from "react";
import { classes } from "../classes";

export type BadgeProps = ComponentProps<"span"> &
	BadgeVariants & {
		/** Decorative icon before the label. */
		icon?: ReactNode;
		/** Accessible name when the content is not text. */
		textValue?: string;
		/** Classes for the parts this component renders, keyed by part name. */
		classes?: BadgeClasses;
	};

/** A short, non-interactive status label. Set `textValue` when the content is not text. */
export function Badge({
	size,
	tone,
	variant,
	icon,
	textValue,
	classes: parts,
	className,
	children,
	...props
}: BadgeProps) {
	const { class: root, ...appearance } = badgeStyleProps({ size, tone, variant });
	return (
		<span
			role="status"
			aria-label={textValue}
			{...appearance}
			{...props}
			className={classes(root, parts?.root, className)}
		>
			{icon ? (
				<span
					aria-hidden="true"
					data-cui={badgeParts.icon}
					className={classes(badgeStyles.icon(), parts?.icon)}
				>
					{icon}
				</span>
			) : null}
			<span
				data-cui={badgeParts.label}
				className={classes(badgeStyles.label(), parts?.label)}
			>
				{children}
			</span>
		</span>
	);
}
