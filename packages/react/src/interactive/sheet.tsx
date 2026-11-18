"use client";

import {
	sheetParts,
	sheetStyleProps,
	sheetStyles,
	type SheetClasses,
	type SheetSide,
} from "@codeui/styles/sheet";
import type { ComponentProps, ReactNode } from "react";
import {
	Button,
	Heading,
	Sheet as RACSheet,
	SheetBackdrop,
	SheetContent,
	SheetOverlay,
	SheetTrigger as RACSheetTrigger,
	type HeadingProps,
	type SheetOverlayProps,
	type SheetTriggerProps,
} from "react-aria-components";
import { classes } from "../classes";
import {
	CloseButton,
	useInputTracking,
	withClasses,
	type CloseButtonProps,
} from "./shared";

export type { SheetClasses, SheetSide };

/** Opens a `Sheet` from the Button inside it. */
export function SheetTrigger(props: SheetTriggerProps) {
	useInputTracking();
	return <RACSheetTrigger {...props} />;
}

export type SheetProps = Omit<
	SheetOverlayProps,
	"children" | "className" | "style" | "render" | "position" | "swipeDirection"
> & {
	/** Edge the sheet is attached to. Defaults to `bottom`. */
	side?: SheetSide;
	/** Shows the 36×4 grip of a bottom sheet. A tap on it closes the sheet. */
	draggable?: boolean;
	title?: ReactNode;
	description?: ReactNode;
	footer?: ReactNode;
	/** Shows the close button in the header. Defaults to true. */
	showCloseButton?: boolean;
	/** Accessible name of the close button and the grip. Defaults to "Close". */
	closeLabel?: string;
	"aria-label"?: string;
	/** Class of the sheet panel. */
	className?: string;
	/** Classes for the parts this component renders, keyed by part name. */
	classes?: SheetClasses;
	children?: ReactNode;
};

/**
 * A panel on a phone (Inkstone §8, §9.5), attached to an edge.
 * React Aria's Sheet moves it with native scrolling, so it follows the finger
 * 1:1 and a swipe toward its edge dismisses it.
 */
export function Sheet({
	side = "bottom",
	draggable,
	title,
	description,
	footer,
	showCloseButton = true,
	closeLabel,
	"aria-label": label,
	className,
	classes: slots,
	children,
	...props
}: SheetProps) {
	const { class: content, ...appearance } = sheetStyleProps({ side });
	const close = showCloseButton && (
		<SheetCloseButton aria-label={closeLabel} className={slots?.closeButton} />
	);
	return (
		<SheetOverlay {...props} position={side} className="cui-react-sheet-layer">
			<SheetBackdrop
				data-cui={sheetParts.overlay}
				className={classes(sheetStyles.overlay(), slots?.overlay)}
			/>
			<RACSheet {...appearance} className={classes(content, slots?.content, className)}>
				<SheetContent aria-label={label} className="cui-react-sheet-dialog">
					{draggable && side === "bottom" && (
						<Button
							slot="close"
							aria-label={closeLabel ?? "Close"}
							data-cui={sheetParts.handle}
							className={classes(sheetStyles.handle(), slots?.handle)}
						/>
					)}
					{(title != null || close) && (
						<SheetHeader className={slots?.header}>
							{title != null && <SheetTitle className={slots?.title}>{title}</SheetTitle>}
							{close}
						</SheetHeader>
					)}
					{description != null && (
						<SheetDescription className={slots?.description}>
							{description}
						</SheetDescription>
					)}
					<SheetBody className={slots?.body}>{children}</SheetBody>
					{footer != null && (
						<SheetFooter className={slots?.footer}>{footer}</SheetFooter>
					)}
				</SheetContent>
			</RACSheet>
		</SheetOverlay>
	);
}

export function SheetHeader({ className, ...props }: ComponentProps<"div">) {
	return (
		<div
			{...props}
			data-cui={sheetParts.header}
			className={classes(sheetStyles.header(), className)}
		/>
	);
}

/** The sheet's name. It labels the sheet. */
export function SheetTitle({ className, ...props }: HeadingProps) {
	return (
		<Heading
			slot="title"
			{...props}
			data-cui={sheetParts.title}
			className={classes(sheetStyles.title(), className)}
		/>
	);
}

export function SheetDescription({ className, ...props }: ComponentProps<"p">) {
	return (
		<p
			{...props}
			data-cui={sheetParts.description}
			className={classes(sheetStyles.description(), className)}
		/>
	);
}

export function SheetCloseButton({
	className,
	...props
}: Omit<CloseButtonProps, "slot">) {
	return (
		<CloseButton
			{...props}
			slot="close"
			data-cui={sheetParts.closeButton}
			className={withClasses(className, sheetStyles.closeButton())}
		/>
	);
}

/** The scrolling content of the sheet. */
export function SheetBody({ className, ...props }: ComponentProps<"div">) {
	return (
		<div
			{...props}
			data-cui={sheetParts.body}
			className={classes(sheetStyles.body(), className)}
		/>
	);
}

export function SheetFooter({ className, ...props }: ComponentProps<"div">) {
	return (
		<div
			{...props}
			data-cui={sheetParts.footer}
			className={classes(sheetStyles.footer(), className)}
		/>
	);
}
