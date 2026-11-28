import { textStyleProps, type TextStyleOptions } from "@codeui/styles/text";
import type { ComponentPropsWithoutRef, ElementType } from "react";
import { classes } from "../classes";

export type TextVariants = Omit<TextStyleOptions, "class">;

export type TextProps<T extends ElementType = "span"> = TextVariants & {
	/** The element to render. Defaults to `span`. */
	as?: T;
} & Omit<ComponentPropsWithoutRef<T>, keyof TextVariants | "as">;

/** Text on the Inkstone type scale (DESIGN.md §3). */
export function Text<T extends ElementType = "span">({
	as,
	size,
	tone,
	weight,
	className,
	...props
}: TextProps<T>) {
	const Component: ElementType = as ?? "span";
	const { class: root, ...appearance } = textStyleProps({ size, tone, weight });
	return <Component {...appearance} {...props} className={classes(root, className)} />;
}
