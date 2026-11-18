import { stackStyleProps, type StackVariants } from "@codeui/styles/stack";
import type { ComponentPropsWithoutRef, ElementType } from "react";
import { classes } from "../classes";

export type StackProps<T extends ElementType = "div"> = StackVariants & {
	/** The element to render. Defaults to `div`. */
	as?: T;
} & Omit<ComponentPropsWithoutRef<T>, keyof StackVariants | "as">;

/** A flex column or row with a gap from the space scale. */
export function Stack<T extends ElementType = "div">({
	as,
	gap,
	align,
	justify,
	direction,
	wrap,
	className,
	...props
}: StackProps<T>) {
	const Component: ElementType = as ?? "div";
	const { class: root, ...appearance } = stackStyleProps({
		gap,
		align,
		justify,
		direction,
		wrap: wrap === undefined ? undefined : wrap ? "true" : "false",
	});
	return <Component {...appearance} {...props} className={classes(root, className)} />;
}
