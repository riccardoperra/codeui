import { icon, iconSize } from "@codeui/styles/icon";
import type { ComponentProps, CSSProperties } from "react";
import { classes } from "../classes";
import { cssVarName } from "./utils";

export type SvgIconProps = ComponentProps<"svg"> & {
	/** Any CSS length. Sets `--cui-icon-size`, which defaults to `1.1em`. */
	size?: string;
};

/** An outline icon sized by the surrounding text. Decorative unless it has an accessible name. */
export function SvgIcon({ size, className, style, ...props }: SvgIconProps) {
	const named = props["aria-label"] != null || props["aria-labelledby"] != null;
	return (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			aria-hidden={named ? undefined : true}
			{...props}
			className={classes(icon, className)}
			style={size ? ({ ...style, [cssVarName(iconSize)]: size } as CSSProperties) : style}
		/>
	);
}
