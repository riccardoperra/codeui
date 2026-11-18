"use client";

import {
	content,
	item,
	rightSlot as rightSlotClass,
	separator,
	subMenuContent,
} from "@codeui/styles/dropdownmenu";
import { useMemo, type ReactNode, type Ref } from "react";
import { mergeRefs } from "react-aria";
import {
	Collection,
	Header,
	Menu,
	MenuItem,
	MenuSection,
	MenuTrigger,
	Popover,
	Separator,
	SubmenuTrigger,
	type MenuItemProps,
	type MenuProps,
	type MenuSectionProps,
	type MenuTriggerProps,
	type PopoverProps,
	type SeparatorProps,
	type SubmenuTriggerProps,
} from "react-aria-components";
import { classes } from "../classes";
import {
	ChevronRightIcon,
	hoverMotionRef,
	popMotionRef,
	useInputTracking,
	withClasses,
} from "./shared";

export type DropdownMenuProps = MenuTriggerProps;

/**
 * Chooses an action (Inkstone §9.5). Put a Button and a
 * `DropdownMenuContent` inside. The menu opens over the layout, focus moves
 * in and returns to the button on close.
 */
export function DropdownMenu(props: DropdownMenuProps) {
	useInputTracking();
	return <MenuTrigger {...props} />;
}

type SurfaceProps = Pick<
	PopoverProps,
	"placement" | "offset" | "crossOffset" | "shouldFlip" | "isNonModal" | "triggerRef"
>;

export type DropdownMenuContentProps<T> = Omit<MenuProps<T>, "className" | "style"> &
	SurfaceProps & {
		/** Class of the floating surface. */
		className?: string;
		/** Class of the menu inside the surface. */
		menuClassName?: string;
		ref?: Ref<HTMLElement>;
	};

function Surface({
	submenu,
	className,
	children,
	ref,
	...props
}: SurfaceProps & {
	submenu?: boolean;
	className?: string;
	children: ReactNode;
	ref?: Ref<HTMLElement>;
}) {
	const mergedRef = useMemo(
		() => mergeRefs(ref, submenu ? hoverMotionRef : popMotionRef),
		[ref, submenu],
	);
	return (
		<Popover
			{...props}
			ref={mergedRef}
			data-cui="dropdownmenu-content"
			className={classes(submenu ? subMenuContent : content, className)}
		>
			{children}
		</Popover>
	);
}

/** The floating menu. A React Aria Menu: pass `items` and a render function, or `DropdownMenuItem` children. */
export function DropdownMenuContent<T extends object>({
	placement = "bottom start",
	offset = 6,
	crossOffset,
	shouldFlip,
	isNonModal,
	triggerRef,
	className,
	menuClassName,
	ref,
	...props
}: DropdownMenuContentProps<T>) {
	return (
		<Surface
			placement={placement}
			offset={offset}
			crossOffset={crossOffset}
			shouldFlip={shouldFlip}
			isNonModal={isNonModal}
			triggerRef={triggerRef}
			className={className}
			ref={ref}
		>
			<Menu<T> {...props} className={classes("cui-react-flow", menuClassName)} />
		</Surface>
	);
}

export type DropdownMenuItemProps<T> = MenuItemProps<T> & {
	/** A hint at the end of the row, such as a shortcut. */
	rightSlot?: ReactNode;
};

/** A menu row: 36px, Label size, field fill while highlighted. */
export function DropdownMenuItem<T extends object>({
	rightSlot,
	children,
	className,
	textValue,
	...props
}: DropdownMenuItemProps<T>) {
	return (
		<MenuItem<T>
			{...props}
			textValue={textValue ?? (typeof children === "string" ? children : undefined)}
			data-cui="dropdownmenu-item"
			className={withClasses(className, item)}
		>
			{values => (
				<>
					{typeof children === "function" ? children(values) : children}
					{rightSlot != null && <div className={rightSlotClass}>{rightSlot}</div>}
					{values.hasSubmenu && rightSlot == null && (
						<div className={rightSlotClass}>
							<ChevronRightIcon />
						</div>
					)}
				</>
			)}
		</MenuItem>
	);
}

export type DropdownMenuSubProps = SubmenuTriggerProps;

/** A nested menu: a `DropdownMenuItem` that opens a `DropdownMenuSubContent`. */
export function DropdownMenuSub({ delay = 120, ...props }: DropdownMenuSubProps) {
	return <SubmenuTrigger delay={delay} {...props} />;
}

export type DropdownMenuSubContentProps<T> = DropdownMenuContentProps<T>;

/** The nested menu, beside its row. It opens on hover, so a pointer that only moved counts for motion. */
export function DropdownMenuSubContent<T extends object>({
	placement = "end top",
	offset = -4,
	crossOffset,
	shouldFlip,
	isNonModal,
	triggerRef,
	className,
	menuClassName,
	ref,
	...props
}: DropdownMenuSubContentProps<T>) {
	return (
		<Surface
			submenu
			placement={placement}
			offset={offset}
			crossOffset={crossOffset}
			shouldFlip={shouldFlip}
			isNonModal={isNonModal}
			triggerRef={triggerRef}
			className={className}
			ref={ref}
		>
			<Menu<T> {...props} className={classes("cui-react-flow", menuClassName)} />
		</Surface>
	);
}

export function DropdownMenuSeparator({ className, ...props }: SeparatorProps) {
	return <Separator {...props} className={classes(separator, className)} />;
}

export type DropdownMenuSectionProps<T> = MenuSectionProps<T> & { title?: ReactNode };

/** A group of rows with an optional heading. */
export function DropdownMenuSection<T extends object>({
	title,
	items,
	children,
	...props
}: DropdownMenuSectionProps<T>) {
	return (
		<MenuSection<T> {...props}>
			{title != null && <Header>{title}</Header>}
			{typeof children === "function" ? (
				<Collection items={items}>{children}</Collection>
			) : (
				children
			)}
		</MenuSection>
	);
}
