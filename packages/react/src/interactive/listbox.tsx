"use client";

import {
	listboxStyleProps,
	type ListboxItemStyleOptions,
	type ListboxStyleOptions,
} from "@codeui/styles/listbox";
import { createContext, useContext, useMemo, type ReactNode } from "react";
import {
	ListBox,
	ListBoxItem,
	ListLayout,
	Virtualizer,
	type ListBoxItemProps,
	type ListBoxProps,
	type ListLayoutOptions,
} from "react-aria-components";
import { classes } from "../classes";
import { CheckIcon, withClasses } from "./shared";

type ItemSize = NonNullable<ListboxItemStyleOptions["size"]>;

export type ListboxClasses = Partial<
	Record<"root" | "item" | "itemLabel" | "itemIndicator", string>
>;

const ListboxContext = createContext<{ size?: ItemSize; classes?: ListboxClasses }>({});

export type ListboxProps<T> = ListBoxProps<T> &
	Omit<ListboxStyleOptions, "class"> & {
		/** Row size: 30, 36 or 40px. Defaults to `sm`. */
		size?: ItemSize;
		/** Classes for the parts this component renders, keyed by part name. */
		classes?: ListboxClasses;
	};

/**
 * A list of options to pick from, in place. A React Aria ListBox: pass
 * `items` and a render function, or `ListboxItem` children, and
 * `selectionMode`. Hover moves the highlight, as the keyboard does.
 */
export function Listbox<T extends object>({
	variant,
	bordered,
	size,
	classes: slots,
	className,
	...props
}: ListboxProps<T>) {
	const { class: base, ...appearance } = listboxStyleProps({ variant, bordered });
	const context = useMemo(() => ({ size, classes: slots }), [size, slots]);
	return (
		<ListboxContext.Provider value={context}>
			{/* `shouldFocusOnHover` reaches React Aria's useListBox; the component types omit it. */}
			<ListBox<T>
				{...({ shouldFocusOnHover: true } as object)}
				{...props}
				{...appearance}
				className={withClasses(className, base, slots?.root)}
			/>
		</ListboxContext.Provider>
	);
}

export type ListboxItemProps<T> = ListBoxItemProps<T> & { size?: ItemSize };

/** An option row with a check that draws in when selected. */
export function ListboxItem<T extends object>({
	size,
	children,
	className,
	textValue,
	...props
}: ListboxItemProps<T>) {
	const context = useContext(ListboxContext);
	const { class: base, ...appearance } = listboxStyleProps.item({
		size: size ?? context.size,
	});
	const indicator = listboxStyleProps.itemIndicator({ size: size ?? context.size });
	return (
		<ListBoxItem<T>
			{...props}
			{...appearance}
			textValue={textValue ?? (typeof children === "string" ? children : undefined)}
			className={withClasses(className, base, context.classes?.item)}
		>
			{values => (
				<>
					<span data-cui="listbox-item-label" className={context.classes?.itemLabel}>
						{typeof children === "function" ? children(values) : children}
					</span>
					<CheckIcon
						data-cui={indicator["data-cui"]}
						data-size={indicator["data-size"]}
						className={classes(indicator.class, context.classes?.itemIndicator)}
					/>
				</>
			)}
		</ListBoxItem>
	);
}

export type VirtualizedListboxProps<T> = ListboxProps<T> & {
	/** Row height before measuring. Rows are measured, so it only needs to be close. */
	estimatedRowHeight?: number;
	layoutOptions?: Omit<ListLayoutOptions, "estimatedRowHeight">;
	children: (item: T) => ReactNode;
};

/**
 * A Listbox that renders only the rows in view, for thousands of options.
 * It scrolls inside the list's max height, 400px by default.
 */
export function VirtualizedListbox<T extends object>({
	estimatedRowHeight = 36,
	layoutOptions,
	style,
	children,
	...props
}: VirtualizedListboxProps<T>) {
	const options = useMemo(
		() => ({ estimatedRowHeight, ...layoutOptions }),
		[estimatedRowHeight, layoutOptions],
	);
	return (
		<Virtualizer layout={ListLayout} layoutOptions={options}>
			<Listbox<T>
				{...props}
				style={values => ({
					maxHeight: "var(--cui-listbox-content-max-height)",
					overflow: "auto",
					...(typeof style === "function" ? style(values) : style),
				})}
			>
				{children}
			</Listbox>
		</Virtualizer>
	);
}
