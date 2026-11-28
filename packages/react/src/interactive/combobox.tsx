"use client";

import {
	comboboxParts,
	comboboxStyleProps,
	comboboxStyles,
	empty,
	type ComboboxClasses,
	type ComboboxStyleOptions,
} from "@codeui/styles/combobox";
import { createContext, useContext, useMemo, type ReactNode, type Ref } from "react";
import { mergeRefs } from "react-aria";
import {
	Button,
	ComboBox,
	FieldError,
	Group,
	Input,
	Label,
	ListBox,
	ListBoxItem,
	Popover,
	Text,
	type ComboBoxProps,
	type InputProps,
	type ListBoxItemProps,
	type ListBoxProps,
	type PopoverProps,
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

export type { ComboboxClasses };

type ComboboxContextValue = Pick<ComboboxStyleOptions, "size"> & {
	classes?: ComboboxClasses;
};
const ComboboxContext = createContext<ComboboxContextValue>({});

export type ComboboxProps<T extends object> = Omit<ComboBoxProps<T>, "children"> & {
	/** Height of the control: 36px or 44px at comfortable density. Defaults to `sm`. */
	size?: ComboboxStyleOptions["size"];
	label?: ReactNode;
	description?: ReactNode;
	errorMessage?: ReactNode | ((validation: ValidationResult) => ReactNode);
	/** Classes for each part, keyed by part name. `content` targets the floating list. */
	classes?: ComboboxClasses;
	/** A `ComboboxInput` and a `ComboboxContent` with the options. */
	children: ReactNode;
};

/**
 * Picks one of many options by typing to filter them (Inkstone §9.1). The
 * typed text and the selected value are separate: pass `inputValue` and
 * `selectedKey` to control them.
 */
export function Combobox<T extends object>({
	size,
	label,
	description,
	errorMessage,
	classes: slots,
	className,
	children,
	...props
}: ComboboxProps<T>) {
	useInputTracking();
	const context = useMemo(() => ({ size, classes: slots }), [size, slots]);
	return (
		<ComboboxContext.Provider value={context}>
			<ComboBox<T>
				{...props}
				data-cui={comboboxParts.root}
				className={withClasses(className, comboboxStyles.root(), slots?.root)}
			>
				{label != null && (
					<Label
						data-cui={comboboxParts.label}
						className={classes(comboboxStyles.label(), slots?.label)}
					>
						{label}
					</Label>
				)}
				{children}
				{description != null && (
					<Text
						slot="description"
						data-cui={comboboxParts.description}
						className={classes(comboboxStyles.description(), slots?.description)}
					>
						{description}
					</Text>
				)}
				<FieldError
					data-cui={comboboxParts.errorMessage}
					className={classes(comboboxStyles.errorMessage(), slots?.errorMessage)}
				>
					{errorMessage}
				</FieldError>
			</ComboBox>
		</ComboboxContext.Provider>
	);
}

export type ComboboxInputProps = Omit<InputProps, "size"> & {
	/** Accessible name of the button that opens the list. Defaults to "Show options". */
	triggerLabel?: string;
};

/** The control: a text input and the button that opens the list. */
export function ComboboxInput({
	className,
	triggerLabel = "Show options",
	...props
}: ComboboxInputProps) {
	const { size, classes: slots } = useContext(ComboboxContext);
	const { class: control, ...appearance } = comboboxStyleProps({ size });
	return (
		<Group {...appearance} className={withClasses(undefined, control, slots?.control)}>
			<Input
				{...props}
				data-cui={comboboxParts.input}
				className={withClasses(className, comboboxStyles.input(), slots?.input)}
			/>
			<Button
				aria-label={triggerLabel}
				data-cui={comboboxParts.trigger}
				className={classes(comboboxStyles.trigger(), slots?.trigger)}
			>
				<span
					aria-hidden="true"
					data-cui={comboboxParts.icon}
					className={classes(comboboxStyles.icon(), slots?.icon)}
				>
					<SelectorIcon />
				</span>
			</Button>
		</Group>
	);
}

export type ComboboxContentProps<T> = Omit<
	ListBoxProps<T>,
	"className" | "style" | "renderEmptyState"
> &
	Pick<
		PopoverProps,
		"placement" | "offset" | "crossOffset" | "shouldFlip" | "maxHeight"
	> & {
		/** Shown in the list when no option matches the text. Set `allowsEmptyCollection` on the Combobox too. */
		emptyContent?: ReactNode;
		className?: string;
		ref?: Ref<HTMLElement>;
	};

/** The floating list, as wide as the control and at most 400px tall. */
export function ComboboxContent<T extends object>({
	emptyContent,
	placement,
	offset,
	crossOffset,
	shouldFlip,
	maxHeight = 400,
	className,
	ref,
	...props
}: ComboboxContentProps<T>) {
	const { classes: slots } = useContext(ComboboxContext);
	const mergedRef = useMemo(() => mergeRefs(ref, popMotionRef), [ref]);
	return (
		<Popover
			placement={placement}
			offset={offset}
			crossOffset={crossOffset}
			shouldFlip={shouldFlip}
			maxHeight={maxHeight}
			ref={mergedRef}
			data-cui={comboboxParts.content}
			className={classes(comboboxStyles.content(), slots?.content, className)}
		>
			<ListBox<T>
				{...props}
				data-cui={comboboxParts.listbox}
				renderEmptyState={
					emptyContent == null
						? undefined
						: () => (
								<div role="presentation" className={empty}>
									{emptyContent}
								</div>
							)
				}
				className={classes(comboboxStyles.listbox(), slots?.listbox)}
			/>
		</Popover>
	);
}

export type ComboboxItemProps<T> = ListBoxItemProps<T> & {
	/** A second line under the label. */
	description?: ReactNode;
};

/** An option: the label, an optional description, and a check when selected. */
export function ComboboxItem<T extends object>({
	description,
	children,
	className,
	textValue,
	...props
}: ComboboxItemProps<T>) {
	const { classes: slots } = useContext(ComboboxContext);
	return (
		<ListBoxItem<T>
			{...props}
			textValue={textValue ?? (typeof children === "string" ? children : undefined)}
			data-cui={comboboxParts.item}
			className={withClasses(className, comboboxStyles.item(), slots?.item)}
		>
			{values => (
				<>
					<Text
						slot="label"
						data-cui={comboboxParts.itemLabel}
						className={classes(comboboxStyles.itemLabel(), slots?.itemLabel)}
					>
						{typeof children === "function" ? children(values) : children}
					</Text>
					{description != null && (
						<Text
							slot="description"
							data-cui={comboboxParts.itemDescription}
							className={classes(
								comboboxStyles.itemDescription(),
								slots?.itemDescription,
							)}
						>
							{description}
						</Text>
					)}
					{values.isSelected && (
						<span
							aria-hidden="true"
							data-cui={comboboxParts.itemIndicator}
							className={classes(comboboxStyles.itemIndicator(), slots?.itemIndicator)}
						>
							<CheckIcon />
						</span>
					)}
				</>
			)}
		</ListBoxItem>
	);
}
