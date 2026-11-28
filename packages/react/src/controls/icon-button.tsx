"use client";

import { iconButton } from "@codeui/styles/iconbutton";
import { composeRenderProps } from "react-aria-components";
import { classes } from "../classes";
import { Button, type ButtonProps } from "./button";

export type IconButtonProps = Omit<ButtonProps, "leftIcon"> & {
	/** An icon-only button needs an accessible name (DESIGN.md §6). */
	"aria-label": string;
};

/** A square Button for one icon. Pair it with a Tooltip in a toolbar. */
export function IconButton({ className, ...props }: IconButtonProps) {
	return (
		<Button
			data-cui="iconbutton"
			{...props}
			className={composeRenderProps(className, className =>
				classes(iconButton, className),
			)}
		/>
	);
}
