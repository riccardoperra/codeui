"use client";

import {
	dialogParts,
	dialogStyleProps,
	dialogStyles,
	navList,
	type DialogBodyLayout,
	type DialogChrome,
	type DialogClasses,
	type DialogMotion,
	type DialogSectionVariant,
	type DialogSize,
} from "@codeui/styles/dialog";
import {
	createContext,
	useContext,
	useId,
	type ComponentProps,
	type KeyboardEvent,
	type ReactNode,
} from "react";
import {
	Button,
	DialogTrigger as RACDialogTrigger,
	Dialog as RACDialog,
	Heading,
	Modal,
	ModalOverlay,
	type ButtonProps,
	type DialogTriggerProps,
	type HeadingProps,
	type ModalOverlayProps,
} from "react-aria-components";
import { classes } from "../classes";
import {
	CloseButton,
	useInputTracking,
	useOpenChangeMotion,
	withClasses,
	type CloseButtonProps,
} from "./shared";

export type {
	DialogBodyLayout,
	DialogChrome,
	DialogClasses,
	DialogMotion,
	DialogSectionVariant,
	DialogSize,
};

const ChromeContext = createContext<DialogChrome>("bar");

/** Opens a `Dialog` from the Button inside it, and returns focus to it on close. */
export function DialogTrigger(props: DialogTriggerProps) {
	useInputTracking();
	return <RACDialogTrigger {...props} />;
}

export type DialogProps = Omit<
	ModalOverlayProps,
	"children" | "className" | "style" | "render"
> & {
	/** Width of the panel. `settings` is 1000×680 for a sidebar and a pane. Defaults to `auto`. */
	size?: DialogSize;
	/** How the header sits in the panel. Defaults to `bar`. */
	chrome?: DialogChrome;
	/** `auto` animates pointer opens and closes; `none` never animates. Defaults to `auto`. */
	motion?: DialogMotion;
	title?: ReactNode;
	description?: ReactNode;
	/** Accessible name of the close button. Defaults to "Close". */
	closeLabel?: string;
	/** `alertdialog` for a decision that blocks. Defaults to `dialog`. */
	role?: "dialog" | "alertdialog";
	"aria-label"?: string;
	/** Classes for the parts this component renders, keyed by part name. */
	classes?: Pick<
		DialogClasses,
		"positioner" | "panel" | "header" | "title" | "description" | "closeButton"
	>;
	className?: string;
	children?: ReactNode | ((options: { close: () => void }) => ReactNode);
};

/**
 * Settings, or a decision that blocks (Inkstone §9.5): a modal panel over a
 * scrim. Focus is trapped inside and returns on close; Escape closes it.
 * Inside a `DialogTrigger`, or controlled with `isOpen` and `onOpenChange`.
 */
export function Dialog({
	size,
	chrome = "bar",
	motion,
	title,
	description,
	closeLabel,
	role,
	"aria-label": label,
	classes: slots,
	className,
	children,
	isDismissable = true,
	...props
}: DialogProps) {
	const motionFor = useOpenChangeMotion(motion);
	const descriptionId = useId();
	const panel = dialogStyleProps({ size });
	const positioner = dialogStyleProps.positioner({
		panelSize: size === "export" || size === "full" ? size : undefined,
		chrome: chrome === "inset" ? "inset" : undefined,
	});
	return (
		<ModalOverlay
			isDismissable={isDismissable}
			{...props}
			data-cui={positioner["data-cui"]}
			data-panel-size={positioner["data-panel-size"]}
			data-chrome={positioner["data-chrome"]}
			render={(domProps, { state }) => (
				<div {...domProps} data-motion={motionFor(state.isOpen)} />
			)}
			className={classes(positioner.class, slots?.positioner)}
		>
			{({ state, isExiting }) => (
				<Modal className="cui-react-modal" data-expanded={isExiting ? undefined : ""}>
					<ChromeContext.Provider value={chrome}>
						<RACDialog
							role={role}
							aria-label={label}
							aria-describedby={description != null ? descriptionId : undefined}
							data-cui={panel["data-cui"]}
							data-size={panel["data-size"]}
							data-chrome={chrome}
							data-motion={motionFor(state.isOpen)}
							data-expanded={isExiting ? undefined : ""}
							className={classes(panel.class, slots?.panel, className)}
						>
							{({ close }) => (
								<>
									{title != null && (
										<DialogHeader className={slots?.header}>
											<DialogTitle className={slots?.title}>{title}</DialogTitle>
											<DialogCloseButton
												aria-label={closeLabel}
												className={slots?.closeButton}
											/>
										</DialogHeader>
									)}
									{description != null && (
										<DialogDescription id={descriptionId} className={slots?.description}>
											{description}
										</DialogDescription>
									)}
									{typeof children === "function" ? children({ close }) : children}
								</>
							)}
						</RACDialog>
					</ChromeContext.Provider>
				</Modal>
			)}
		</ModalOverlay>
	);
}

/** The title row. In a settings dialog, put it in `DialogMain`. */
export function DialogHeader({ className, ...props }: ComponentProps<"div">) {
	return (
		<div
			{...props}
			data-cui={dialogParts.header}
			className={classes(dialogStyles.header(), className)}
		/>
	);
}

/** The dialog's name. It labels the dialog. */
export function DialogTitle({ className, ...props }: HeadingProps) {
	return (
		<Heading
			slot="title"
			{...props}
			data-cui={dialogParts.title}
			className={classes(dialogStyles.title(), className) || undefined}
		/>
	);
}

export function DialogDescription({ className, ...props }: ComponentProps<"p">) {
	return (
		<p
			{...props}
			data-cui={dialogParts.description}
			className={classes(dialogStyles.description(), className)}
		/>
	);
}

/** Closes the dialog. A ghost button in `inset` chrome. */
export function DialogCloseButton({
	className,
	...props
}: Omit<CloseButtonProps, "slot">) {
	const chrome = useContext(ChromeContext);
	return (
		<CloseButton
			{...props}
			slot="close"
			size={chrome === "inset" ? "sm" : "xs"}
			ghost={chrome === "inset"}
			data-cui={dialogParts.closeButton}
			className={withClasses(className, dialogStyles.closeButton())}
		/>
	);
}

export type DialogBodyProps = ComponentProps<"div"> & {
	/** `split` puts a preview beside its options, in one column on a phone. */
	layout?: DialogBodyLayout;
};

export function DialogBody({ layout, className, ...props }: DialogBodyProps) {
	const { class: base, ...appearance } = dialogStyleProps.body({ layout });
	return <div {...props} {...appearance} className={classes(base, className)} />;
}

/** Close and Confirm on the right; a tertiary action may sit on the left (Inkstone §9.7). */
export function DialogFooter({ className, ...props }: ComponentProps<"div">) {
	return (
		<div
			{...props}
			data-cui={dialogParts.footer}
			className={classes(dialogStyles.footer(), className)}
		/>
	);
}

export type DialogSidebarProps = ComponentProps<"div"> & {
	/** Content above the navigation, such as a search field. */
	search?: ReactNode;
	classes?: Pick<DialogClasses, "sidebarSearch">;
};

/** The 232px left pane of a settings dialog. On a phone it becomes rows above the body. */
export function DialogSidebar({
	search,
	classes: slots,
	className,
	children,
	...props
}: DialogSidebarProps) {
	return (
		<div
			{...props}
			data-cui={dialogParts.sidebar}
			className={classes(dialogStyles.sidebar(), className)}
		>
			{search != null && (
				<div
					data-cui={dialogParts.sidebarSearch}
					className={classes(dialogStyles.sidebarSearch(), slots?.sidebarSearch)}
				>
					{search}
				</div>
			)}
			{children}
		</div>
	);
}

const navStep: Record<string, number | "first" | "last"> = {
	ArrowDown: 1,
	ArrowRight: 1,
	ArrowUp: -1,
	ArrowLeft: -1,
	Home: "first",
	End: "last",
};

export type DialogNavProps = Omit<ComponentProps<"nav">, "aria-label"> & {
	/** Accessible name of the navigation, such as "Settings sections". */
	"aria-label": string;
};

/** The list of sections. Arrow keys move between items, Home and End jump to the ends. */
export function DialogNav({ className, children, onKeyDown, ...props }: DialogNavProps) {
	const move = (event: KeyboardEvent<HTMLElement>) => {
		onKeyDown?.(event);
		const step = navStep[event.key];
		if (step === undefined || event.defaultPrevented) return;
		const items = [
			...event.currentTarget.querySelectorAll<HTMLElement>(
				`[data-cui="${dialogParts.navItem}"]:not(:disabled)`,
			),
		];
		const index = items.findIndex(item => item === document.activeElement);
		if (index < 0) return;
		event.preventDefault();
		const next =
			step === "first"
				? 0
				: step === "last"
					? items.length - 1
					: (index + step + items.length) % items.length;
		items[next]?.focus();
	};
	return (
		<nav
			{...props}
			onKeyDown={move}
			data-cui={dialogParts.nav}
			className={classes(dialogStyles.nav(), className)}
		>
			<ul className={navList}>{children}</ul>
		</nav>
	);
}

export type DialogNavItemProps = Omit<ButtonProps, "children" | "className"> & {
	/** Marks the section on screen with `aria-current="page"` and a field fill. */
	isCurrent?: boolean;
	/** A 16px icon before the label. Hidden on a phone. */
	icon?: ReactNode;
	children?: ReactNode;
	className?: string;
	classes?: Pick<DialogClasses, "navIcon">;
};

export function DialogNavItem({
	isCurrent,
	icon,
	children,
	classes: slots,
	className,
	...props
}: DialogNavItemProps) {
	return (
		<li>
			<Button
				{...props}
				aria-current={isCurrent ? "page" : undefined}
				data-cui={dialogParts.navItem}
				className={classes(dialogStyles.navItem(), className)}
			>
				{icon != null && (
					<span
						aria-hidden="true"
						data-cui={dialogParts.navIcon}
						className={classes(dialogStyles.navIcon(), slots?.navIcon)}
					>
						{icon}
					</span>
				)}
				{children}
			</Button>
		</li>
	);
}

/** The pane next to the sidebar. Put the `DialogHeader` and the `DialogBody` in it. */
export function DialogMain({ className, ...props }: ComponentProps<"div">) {
	return (
		<div
			{...props}
			data-cui={dialogParts.main}
			className={classes(dialogStyles.main(), className)}
		/>
	);
}

export type DialogSectionProps = Omit<ComponentProps<"section">, "title"> & {
	/** Heading of the section. `group` puts it over the island, `well` inside it. */
	title?: ReactNode;
	/** `group` is a title over one island of rows; `well` makes the section the island. Defaults to `group`. */
	variant?: DialogSectionVariant;
	/** Two columns, one on a phone. Defaults to 1. */
	columns?: 1 | 2;
	classes?: Pick<DialogClasses, "sectionTitle" | "sectionContent">;
};

export function DialogSection({
	title,
	variant,
	columns,
	classes: slots,
	className,
	children,
	...props
}: DialogSectionProps) {
	const { class: base, ...appearance } = dialogStyleProps.section({
		variant,
		columns: columns === 2 ? "2" : undefined,
	});
	const titleId = useId();
	return (
		<section
			aria-labelledby={title != null ? titleId : undefined}
			{...props}
			{...appearance}
			className={classes(base, className)}
		>
			{title != null && (
				<h3
					id={titleId}
					data-cui={dialogParts.sectionTitle}
					className={classes(dialogStyles.sectionTitle(), slots?.sectionTitle)}
				>
					{title}
				</h3>
			)}
			<div
				data-cui={dialogParts.sectionContent}
				className={classes(dialogStyles.sectionContent(), slots?.sectionContent)}
			>
				{children}
			</div>
		</section>
	);
}
