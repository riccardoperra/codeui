"use client";

import { errorMessage as errorClass } from "@codeui/styles/fielderror";
import { label as labelClass } from "@codeui/styles/fieldlabel";
import { description as descriptionClass } from "@codeui/styles/fieldmessage";
import {
	content,
	item,
	itemIndicator,
	selectStyleProps,
	type SelectStyleOptions,
} from "@codeui/styles/select";
import { createContext, useContext, useMemo, type ReactNode, type Ref } from "react";
import { mergeRefs } from "react-aria";
import {
	Button,
	FieldError,
	Label,
	ListBox,
	ListBoxItem,
	Popover,
	Select as RACSelect,
	SelectStateContext,
	SelectValue,
	Text,
	type ButtonProps,
	type ListBoxItemProps,
	type ListBoxProps,
	type PopoverProps,
	type SelectProps as RACSelectProps,
	type ValidationResult,
} from "react-aria-components";
import { classes } from "../classes";
import {
	CheckIcon,
	SelectorIcon,
	popMotionRef,
	useInputTracking,
	withClasses,
} from "./shared";

export const selectParts = {
	root: "select",
	label: "select-label",
	trigger: "select-trigger",
	value: "select-value",
	icon: "select-icon",
	description: "select-description",
	errorMessage: "select-error-message",
	content: "select-content",
	listbox: "select-listbox",
	item: "select-item",
	itemLabel: "select-item-label",
	itemIndicator: "select-item-indicator",
} as const;

export type SelectPart = keyof typeof selectParts;
export type SelectClasses = Partial<Record<SelectPart, string>>;

type FieldSize = NonNullable<SelectStyleOptions["size"]>;
type SelectContextValue = Pick<SelectStyleOptions, "size" | "variant"> & {
	classes?: SelectClasses;
};
const SelectContext = createContext<SelectContextValue>({});

export type SelectProps<T extends object> = Omit<RACSelectProps<T>, "children"> & {
	/** Height of the trigger, on the shared control scale. Defaults to `sm`. */
	size?: FieldSize;
	/** `inline` draws only an underline. Defaults to `filled`. */
	variant?: SelectStyleOptions["variant"];
	label?: ReactNode;
	description?: ReactNode;
	errorMessage?: ReactNode | ((validation: ValidationResult) => ReactNode);
	/** Classes for each part, keyed by part name. `content` targets the floating list. */
	classes?: SelectClasses;
	/** The trigger and the content. Defaults to a `SelectTrigger`; pass `SelectContent` with the options. */
	children: ReactNode;
};

/**
 * Picks one of many options known by name (Inkstone §9.1). Inside a modal
 * dialog, prefer a segmented control, switch or cards.
 */
export function Select<T extends object>({
	size,
	variant,
	label,
	description,
	errorMessage,
	classes: slots,
	className,
	children,
	...props
}: SelectProps<T>) {
	useInputTracking();
	const { class: base, ...appearance } = selectStyleProps.root({ fieldSize: size });
	const context = useMemo(
		() => ({ size, variant, classes: slots }),
		[size, variant, slots],
	);
	return (
		<SelectContext.Provider value={context}>
			<RACSelect<T>
				{...props}
				{...appearance}
				className={withClasses(className, base, slots?.root)}
			>
				{label != null && (
					<Label
						data-cui={selectParts.label}
						className={classes(labelClass, slots?.label)}
					>
						{label}
					</Label>
				)}
				{children}
				{description != null && (
					<Text
						slot="description"
						data-cui={selectParts.description}
						className={classes(descriptionClass, slots?.description)}
					>
						{description}
					</Text>
				)}
				<FieldError
					data-cui={selectParts.errorMessage}
					className={classes(errorClass, slots?.errorMessage)}
				>
					{errorMessage}
				</FieldError>
			</RACSelect>
		</SelectContext.Provider>
	);
}

export type SelectTriggerProps = Omit<ButtonProps, "children"> & {
	/** Renders the selected option. Defaults to its text. */
	children?: ReactNode;
};

/** The field that shows the value and opens the list. */
export function SelectTrigger({ className, children, ...props }: SelectTriggerProps) {
	const { size, variant, classes: slots } = useContext(SelectContext);
	const state = useContext(SelectStateContext);
	const { class: base, ...appearance } = selectStyleProps.trigger({ size, variant });
	return (
		<Button
			{...props}
			{...appearance}
			data-invalid={state?.displayValidation.isInvalid ? "" : undefined}
			className={withClasses(className, base, slots?.trigger)}
		>
			{children ?? <SelectValue data-cui={selectParts.value} className={slots?.value} />}
			<span aria-hidden="true" data-cui={selectParts.icon} className={slots?.icon}>
				<SelectorIcon />
			</span>
		</Button>
	);
}

export type SelectContentProps<T> = Omit<ListBoxProps<T>, "className" | "style"> &
	Pick<
		PopoverProps,
		"placement" | "offset" | "crossOffset" | "shouldFlip" | "maxHeight"
	> & {
		className?: string;
		ref?: Ref<HTMLElement>;
	};

/** The floating list, at least as wide as the trigger. A React Aria ListBox inside a Popover. */
export function SelectContent<T extends object>({
	placement,
	offset,
	crossOffset,
	shouldFlip,
	maxHeight = 400,
	className,
	ref,
	...props
}: SelectContentProps<T>) {
	const { classes: slots } = useContext(SelectContext);
	const mergedRef = useMemo(() => mergeRefs(ref, popMotionRef), [ref]);
	return (
		<Popover
			placement={placement}
			offset={offset}
			crossOffset={crossOffset}
			shouldFlip={shouldFlip}
			maxHeight={maxHeight}
			ref={mergedRef}
			data-cui={selectParts.content}
			className={classes(content, slots?.content, className)}
		>
			<ListBox<T>
				{...props}
				data-cui={selectParts.listbox}
				className={classes("cui-react-flow", slots?.listbox)}
			/>
		</Popover>
	);
}

export type SelectItemProps<T> = ListBoxItemProps<T>;

/** An option. The selected one shows a check. */
export function SelectItem<T extends object>({
	children,
	className,
	textValue,
	...props
}: SelectItemProps<T>) {
	const { classes: slots } = useContext(SelectContext);
	return (
		<ListBoxItem<T>
			{...props}
			textValue={textValue ?? (typeof children === "string" ? children : undefined)}
			data-cui={selectParts.item}
			className={withClasses(className, item, slots?.item)}
		>
			{values => (
				<>
					<span data-cui={selectParts.itemLabel} className={slots?.itemLabel}>
						{typeof children === "function" ? children(values) : children}
					</span>
					{values.isSelected && (
						<CheckIcon
							data-cui={selectParts.itemIndicator}
							className={classes(itemIndicator, slots?.itemIndicator)}
						/>
					)}
				</>
			)}
		</ListBoxItem>
	);
}
