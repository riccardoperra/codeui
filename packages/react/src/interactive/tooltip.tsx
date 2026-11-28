"use client";

import {
	tooltipStyleProps,
	trigger,
	type TooltipStyleOptions,
} from "@codeui/styles/tooltip";
import {
	useCallback,
	useContext,
	useMemo,
	useRef,
	type ComponentProps,
	type ReactNode,
	type Ref,
} from "react";
import { mergeRefs } from "react-aria";
import {
	Focusable,
	Tooltip as RACTooltip,
	TooltipTrigger as RACTooltipTrigger,
	TooltipTriggerStateContext,
	type TooltipProps as RACTooltipProps,
	type TooltipTriggerComponentProps,
} from "react-aria-components";
import { classes } from "../classes";
import { pointerInitiated, useInputTracking, withClasses } from "./shared";

export type TooltipProps = TooltipTriggerComponentProps;

/**
 * Names an icon or explains a value (Inkstone §9.5). Put the trigger and a
 * `TooltipContent` inside. It opens on hover after 200ms and on keyboard
 * focus; once one tooltip is open, the next opens at once and without motion.
 */
export function Tooltip({ delay = 200, closeDelay = 0, ...props }: TooltipProps) {
	useInputTracking();
	return <RACTooltipTrigger delay={delay} closeDelay={closeDelay} {...props} />;
}

export type TooltipTriggerProps = ComponentProps<"span">;

/**
 * Makes any content a focusable tooltip trigger, such as a value the tooltip
 * explains. A React Aria Button, like the kit IconButton, is a trigger on its
 * own and needs no wrapper.
 */
export function TooltipTrigger({ className, ...props }: TooltipTriggerProps) {
	return (
		<Focusable>
			<span
				tabIndex={0}
				{...props}
				data-cui="tooltip-trigger"
				className={classes(trigger, className)}
			/>
		</Focusable>
	);
}

export type TooltipContentProps = Omit<RACTooltipProps, "children"> &
	Pick<TooltipStyleOptions, "variant"> & {
		children?: ReactNode;
		ref?: Ref<HTMLDivElement>;
	};

/** The bubble. `primary`, the default, is the strong fill; `secondary` is quieter. */
export function TooltipContent({
	variant = "primary",
	offset = 4,
	className,
	ref,
	...props
}: TooltipContentProps) {
	const state = useContext(TooltipTriggerStateContext);
	// A warm tooltip opens in place, as does one opened from the keyboard.
	const skip = useRef(false);
	skip.current = !!state?.shouldSkipAnimation;
	const motion = useCallback((element: HTMLElement | null) => {
		if (!element) return;
		if (!skip.current && pointerInitiated("hover"))
			element.removeAttribute("data-motion");
		else element.setAttribute("data-motion", "none");
	}, []);
	const mergedRef = useMemo(() => mergeRefs<HTMLDivElement>(ref, motion), [ref, motion]);
	const { class: base, ...appearance } = tooltipStyleProps({ variant });
	return (
		<RACTooltip
			offset={offset}
			{...props}
			{...appearance}
			ref={mergedRef}
			className={withClasses(className, base)}
		/>
	);
}
