"use client";

import {
	buttonIcon,
	buttonStyleProps,
	type ButtonStyleOptions,
} from "@codeui/styles/button";
import {
	pointer,
	pointerAnimationDelay,
	pointerGroup,
	wrapper,
} from "@codeui/styles/loading";
import type { ComponentProps, CSSProperties, ReactNode } from "react";
import {
	Button as AriaButton,
	ProgressBar,
	composeRenderProps,
} from "react-aria-components";
import { classes } from "../classes";
import { cssVarName, flag } from "./utils";

export type ButtonAppearance = Omit<ButtonStyleOptions, "class">;

export type ButtonProps = ComponentProps<typeof AriaButton> &
	ButtonAppearance & {
		/** Decorative icon before the label. */
		leftIcon?: ReactNode;
	};

/**
 * React Aria's Button with the Inkstone appearance. `isPending` shows the loading dots, keeps focus
 * and blocks presses without disabling the button (DESIGN.md §9.10).
 */
export function Button({
	size,
	variant,
	ghost,
	block,
	pill,
	leftIcon,
	isPending,
	className,
	children,
	...props
}: ButtonProps) {
	const { class: root, ...appearance } = buttonStyleProps({
		size,
		variant,
		ghost,
		block,
		pill,
	});
	return (
		<AriaButton
			{...appearance}
			data-loading={flag(isPending)}
			{...props}
			isPending={isPending}
			className={composeRenderProps(className, className => classes(root, className))}
		>
			{composeRenderProps(children, children => (
				<>
					{isPending ? <Loading /> : null}
					{leftIcon ? <ButtonIcon>{leftIcon}</ButtonIcon> : null}
					{children}
				</>
			))}
		</AriaButton>
	);
}

/** The slot for a decorative icon inside a Button. */
export function ButtonIcon({ className, ...props }: ComponentProps<"span">) {
	return (
		<span aria-hidden="true" {...props} className={classes(buttonIcon, className)} />
	);
}

const delay = cssVarName(pointerAnimationDelay);

/** Three pulsing dots. Inside a Button the progress bar joins the button's accessible name. */
function Loading() {
	return (
		<ProgressBar isIndeterminate aria-label="Loading" className={wrapper}>
			<span className={pointerGroup}>
				<i className={pointer} />
				<i className={pointer} style={{ [delay]: "0.2s" } as CSSProperties} />
				<i className={pointer} style={{ [delay]: "0.4s" } as CSSProperties} />
			</span>
		</ProgressBar>
	);
}
