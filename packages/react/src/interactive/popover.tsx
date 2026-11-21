"use client";

import {
	popoverParts,
	popoverStyleProps,
	popoverStyles,
	type PopoverClasses,
	type PopoverVariant,
} from "@codeui/styles/popover";
import { useId, useMemo, type ComponentProps, type ReactNode, type Ref } from "react";
import { mergeRefs } from "react-aria";
import {
	Dialog,
	DialogTrigger,
	Heading,
	Popover as RACPopover,
	type DialogTriggerProps,
	type HeadingProps,
	type PopoverProps as RACPopoverProps,
} from "react-aria-components";
import { classes } from "../classes";
import { popMotionRef, useInputTracking, withClasses } from "./shared";

export type { PopoverClasses, PopoverVariant };

export type PopoverProps = DialogTriggerProps;

/**
 * Picks a value for one row (Inkstone §9.5). Put a Button and a
 * `PopoverContent` inside; the button toggles the popover, focus moves in,
 * and it returns to the button on close.
 */
export function Popover(props: PopoverProps) {
	useInputTracking();
	return <DialogTrigger {...props} />;
}

export type PopoverContentProps = Omit<RACPopoverProps, "children"> & {
	children?: ReactNode;
	title?: ReactNode;
	/** Short text that describes the popover. It is linked with `aria-describedby`. */
	description?: ReactNode;
	/** `bordered` adds a 1px ring. Defaults to `default`. */
	variant?: PopoverVariant;
	/** Accessible name when there is no `title`. */
	"aria-label"?: string;
	/** Classes for the parts this component renders, keyed by part name. */
	classes?: Pick<PopoverClasses, "content" | "title" | "description">;
	ref?: Ref<HTMLElement>;
};

/** The floating surface, anchored to the trigger: 360px wide at most, radius 16, padding 16. */
export function PopoverContent({
	children,
	title,
	description,
	variant,
	offset = 6,
	classes: slots,
	className,
	ref,
	"aria-label": label,
	...props
}: PopoverContentProps) {
	const descriptionId = useId();
	const mergedRef = useMemo(() => mergeRefs(ref, popMotionRef), [ref]);
	const { class: base, ...appearance } = popoverStyleProps({ variant });
	return (
		<RACPopover
			offset={offset}
			{...props}
			{...appearance}
			ref={mergedRef}
			className={withClasses(className, base, slots?.content)}
		>
			<Dialog
				aria-label={label}
				aria-describedby={description != null ? descriptionId : undefined}
				className="cui-react-flow"
			>
				{title != null && <PopoverTitle className={slots?.title}>{title}</PopoverTitle>}
				{description != null && (
					<PopoverDescription id={descriptionId} className={slots?.description}>
						{description}
					</PopoverDescription>
				)}
				{children}
			</Dialog>
		</RACPopover>
	);
}

/** The popover heading. It names the popover. */
export function PopoverTitle({ className, ...props }: HeadingProps) {
	return (
		<Heading
			slot="title"
			level={3}
			{...props}
			data-cui={popoverParts.title}
			className={classes(popoverStyles.title(), className)}
		/>
	);
}

export function PopoverDescription({ className, ...props }: ComponentProps<"p">) {
	return (
		<p
			{...props}
			data-cui={popoverParts.description}
			className={classes(popoverStyles.description(), className)}
		/>
	);
}
