"use client";

import { linkStyleProps, type LinkStyleOptions } from "@codeui/styles/link";
import type { ComponentProps } from "react";
import { Link as AriaLink, composeRenderProps } from "react-aria-components";
import { classes } from "../classes";

export type LinkProps = ComponentProps<typeof AriaLink> & Omit<LinkStyleOptions, "class">;

/** React Aria's Link with the Inkstone accent text. Without `href` it renders a focusable span. */
export function Link({ variant, className, ...props }: LinkProps) {
	const { class: root, ...appearance } = linkStyleProps({ variant });
	return (
		<AriaLink
			{...appearance}
			{...props}
			className={composeRenderProps(className, className => classes(root, className))}
		/>
	);
}
