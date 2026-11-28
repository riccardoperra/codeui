import { kbdStyleProps, type KbdVariants } from "@codeui/styles/kbd";
import type { ComponentProps } from "react";
import { classes } from "../classes";

export type KbdProps = ComponentProps<"kbd"> & KbdVariants;

/** One key or key label. Render a sequence as several Kbd elements. */
export function Kbd({ size, variant, className, ...props }: KbdProps) {
	const { class: root, ...appearance } = kbdStyleProps({ size, variant });
	return <kbd {...appearance} {...props} className={classes(root, className)} />;
}
