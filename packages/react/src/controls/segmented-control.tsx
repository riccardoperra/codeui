"use client";

import {
	indicator,
	list,
	segment,
	segmentedControlStyleProps,
	type SegmentedControlStyleOptions,
} from "@codeui/styles/segmentedcontrol";
import {
	createContext,
	useContext,
	useLayoutEffect,
	useRef,
	type ComponentProps,
	type ReactNode,
} from "react";
import {
	ToggleButton,
	ToggleButtonGroup,
	composeRenderProps,
	type Selection,
} from "react-aria-components";
import { classes } from "../classes";
import { useInputTracking } from "../input-modality";

export type SegmentedControlClasses = Partial<
	Record<"root" | "list" | "indicator" | "item", string>
>;

const ItemClass = createContext<string | undefined>(undefined);

export type SegmentedControlProps = Omit<
	ComponentProps<typeof ToggleButtonGroup>,
	"children" | "orientation"
> &
	Omit<SegmentedControlStyleOptions, "class"> & {
		/** SegmentedControlItem elements. */
		children?: ReactNode;
		/** Classes for the parts this component renders, keyed by part name. */
		classes?: SegmentedControlClasses;
	};

/**
 * React Aria's ToggleButtonGroup with one selected segment at all times: 2–4 short options changed
 * while working (DESIGN.md §9.1). Select with `selectedKeys` or `defaultSelectedKeys`.
 */
export function SegmentedControl({
	size,
	accent,
	variant,
	fluid,
	pill,
	autoWidth,
	selectionMode = "single",
	disallowEmptySelection = true,
	classes: parts,
	className,
	children,
	...props
}: SegmentedControlProps) {
	useInputTracking();
	const { class: root, ...appearance } = segmentedControlStyleProps({
		size,
		accent,
		variant,
		fluid,
		pill,
		autoWidth,
	});
	return (
		<ToggleButtonGroup
			{...appearance}
			{...props}
			selectionMode={selectionMode}
			disallowEmptySelection={disallowEmptySelection}
			orientation="horizontal"
			className={composeRenderProps(className, className =>
				classes(root, parts?.root, className),
			)}
		>
			{({ state }) => (
				<SegmentList
					selectedKeys={state.selectedKeys}
					className={parts?.list}
					indicatorClassName={parts?.indicator}
				>
					<ItemClass.Provider value={parts?.item}>{children}</ItemClass.Provider>
				</SegmentList>
			)}
		</ToggleButtonGroup>
	);
}

/** Holds the segments and moves the indicator under the selected one. */
function SegmentList({
	selectedKeys,
	className,
	indicatorClassName,
	children,
}: {
	selectedKeys: Selection;
	className?: string;
	indicatorClassName?: string;
	children: ReactNode;
}) {
	const listRef = useRef<HTMLDivElement>(null);
	const indicatorRef = useRef<HTMLDivElement>(null);
	const placed = useRef(false);

	useLayoutEffect(() => {
		const listElement = listRef.current;
		const indicatorElement = indicatorRef.current;
		if (!listElement || !indicatorElement) return;
		const place = () => {
			const selected = listElement.querySelector<HTMLElement>(":scope > [data-selected]");
			indicatorElement.hidden = !selected;
			if (!selected) return;
			// The first placement is not a change of value, so it does not animate (DESIGN.md §1.5).
			if (!placed.current) indicatorElement.style.transition = "none";
			indicatorElement.style.width = `${selected.offsetWidth}px`;
			indicatorElement.style.transform = `translateX(${selected.offsetLeft}px)`;
			if (!placed.current) {
				void indicatorElement.offsetWidth;
				indicatorElement.style.transition = "";
				placed.current = true;
			}
		};
		place();
		const observer = new ResizeObserver(place);
		observer.observe(listElement);
		return () => observer.disconnect();
	}, [selectedKeys]);

	return (
		<div
			ref={listRef}
			data-cui="segmentedcontrol-list"
			className={classes(list, className)}
		>
			{children}
			<div
				ref={indicatorRef}
				aria-hidden="true"
				data-cui="segmentedcontrol-indicator"
				className={classes(indicator, indicatorClassName)}
			/>
		</div>
	);
}

export type SegmentedControlItemProps = ComponentProps<typeof ToggleButton>;

/** One segment. Its `id` is the key that `selectedKeys` holds. */
export function SegmentedControlItem({ className, ...props }: SegmentedControlItemProps) {
	const itemClass = useContext(ItemClass);
	return (
		<ToggleButton
			data-cui="segmentedcontrol-item"
			{...props}
			className={composeRenderProps(className, className =>
				classes(segment, itemClass, className),
			)}
		/>
	);
}
