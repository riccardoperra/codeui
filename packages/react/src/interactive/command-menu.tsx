"use client";

import {
	commandMenuParts,
	commandMenuStyles,
	type CommandMenuClasses,
} from "@codeui/styles/commandmenu";
import { dialogStyles } from "@codeui/styles/dialog";
import { createContext, useContext, useId, type ReactNode } from "react";
import {
	Autocomplete,
	Collection,
	Dialog,
	Header,
	Heading,
	Input,
	ListBox,
	ListBoxItem,
	ListBoxSection,
	Modal,
	ModalOverlay,
	OverlayTriggerStateContext,
	Text,
	TextField,
	type AutocompleteProps,
	type Key,
	type ListBoxItemProps,
	type ListBoxProps,
	type ListBoxSectionProps,
	type ModalOverlayProps,
} from "react-aria-components";
import { classes } from "../classes";
import { CheckIcon, SearchIcon, withClasses } from "./shared";

export type { CommandMenuClasses };

const CommandMenuContext = createContext<{
	titleId?: string;
	classes?: CommandMenuClasses;
}>({});

/** Keeps the options whose text contains every word of the query, in any order. */
export function matchCommand(textValue: string, query: string) {
	const text = textValue.toLowerCase();
	return query
		.toLowerCase()
		.split(/\s+/)
		.filter(Boolean)
		.every(word => text.includes(word));
}

export type CommandMenuProps = Omit<
	ModalOverlayProps,
	"children" | "className" | "style" | "render"
> &
	Pick<
		AutocompleteProps<object>,
		"inputValue" | "defaultInputValue" | "onInputChange" | "filter"
	> & {
		/** The accessible name of the dialog, the search field and the list. Not shown. */
		title: ReactNode;
		className?: string;
		/** Classes for the parts this component renders, keyed by part name. */
		classes?: CommandMenuClasses;
		/** A `CommandMenuSearch` and a `CommandMenuList`. */
		children: ReactNode;
	};

/**
 * Finds anything by name (Inkstone §9.6): bottom centre, no scrim, focus
 * trapped and returned on close. It never animates. Bind the shortcut, such
 * as Mod+K, in the app. Every open starts with an empty query.
 */
export function CommandMenu({
	title,
	inputValue,
	defaultInputValue,
	onInputChange,
	filter = matchCommand,
	className,
	classes: slots,
	children,
	isDismissable = true,
	...props
}: CommandMenuProps) {
	const titleId = useId();
	return (
		<ModalOverlay
			isDismissable={isDismissable}
			{...props}
			data-cui={commandMenuParts.overlay}
			className={classes(commandMenuStyles.overlay(), slots?.overlay)}
		>
			<Modal className="cui-react-modal">
				<Dialog
					aria-labelledby={titleId}
					data-cui={commandMenuParts.content}
					className={classes(
						dialogStyles.panel(),
						commandMenuStyles.content(),
						slots?.content,
						className,
					)}
				>
					<CommandMenuContext.Provider value={{ titleId, classes: slots }}>
						<Heading
							slot="title"
							id={titleId}
							data-cui={commandMenuParts.title}
							className={classes(commandMenuStyles.title(), slots?.title)}
						>
							{title}
						</Heading>
						<Autocomplete
							inputValue={inputValue}
							defaultInputValue={defaultInputValue}
							onInputChange={onInputChange}
							filter={filter}
						>
							{children}
						</Autocomplete>
					</CommandMenuContext.Provider>
				</Dialog>
			</Modal>
		</ModalOverlay>
	);
}

export type CommandMenuSearchProps = {
	placeholder?: string;
	/** Key hints at the end of the field, such as "↑↓ preview · ↵ apply · esc cancel". Hidden on phones. */
	hint?: ReactNode;
};

/** The search field. It keeps focus while the arrows move the highlight in the list. */
export function CommandMenuSearch({ placeholder, hint }: CommandMenuSearchProps) {
	const { titleId, classes: slots } = useContext(CommandMenuContext);
	return (
		<TextField
			aria-labelledby={titleId}
			autoFocus
			data-cui={commandMenuParts.search}
			className={classes(commandMenuStyles.search(), slots?.search)}
		>
			<SearchIcon />
			<Input
				placeholder={placeholder}
				autoComplete="off"
				spellCheck={false}
				data-cui={commandMenuParts.searchInput}
				className={classes(commandMenuStyles.searchInput(), slots?.searchInput)}
			/>
			{hint != null && (
				<span
					aria-hidden="true"
					data-cui={commandMenuParts.hint}
					className={classes(commandMenuStyles.hint(), slots?.hint)}
				>
					{hint}
				</span>
			)}
		</TextField>
	);
}

export type CommandMenuListProps<T> = Omit<ListBoxProps<T>, "renderEmptyState"> & {
	/** Shown while no option matches the query. */
	emptyContent?: ReactNode;
};

/**
 * Six rows at the shared height, then it scrolls. Enter or a click runs
 * `onAction` after the menu closes.
 */
export function CommandMenuList<T extends object>({
	emptyContent,
	onAction,
	className,
	...props
}: CommandMenuListProps<T>) {
	const { titleId, classes: slots } = useContext(CommandMenuContext);
	const state = useContext(OverlayTriggerStateContext);
	return (
		<ListBox<T>
			aria-labelledby={titleId}
			autoFocus="first"
			{...props}
			onAction={(key: Key) => {
				state?.close();
				onAction?.(key);
			}}
			renderEmptyState={
				emptyContent == null
					? undefined
					: () => (
							<div
								role="status"
								data-cui={commandMenuParts.empty}
								className={classes(commandMenuStyles.empty(), slots?.empty)}
							>
								{emptyContent}
							</div>
						)
			}
			data-cui={commandMenuParts.listbox}
			className={withClasses(className, commandMenuStyles.listbox(), slots?.listbox)}
		/>
	);
}

export type CommandMenuSectionProps<T> = ListBoxSectionProps<T> & {
	/** The group label, in Meta 600 above its rows. */
	title?: ReactNode;
};

export function CommandMenuSection<T extends object>({
	title,
	items,
	children,
	...props
}: CommandMenuSectionProps<T>) {
	const { classes: slots } = useContext(CommandMenuContext);
	return (
		<ListBoxSection<T> {...props}>
			{title != null && (
				<Header
					data-cui={commandMenuParts.group}
					className={classes(commandMenuStyles.group(), slots?.group)}
				>
					{title}
				</Header>
			)}
			{typeof children === "function" ? (
				<Collection items={items}>{children}</Collection>
			) : (
				children
			)}
		</ListBoxSection>
	);
}

export type CommandMenuItemProps<T> = Omit<ListBoxItemProps<T>, "children"> & {
	children: ReactNode;
	/** A visual before the label, such as an icon or a swatch. */
	leading?: ReactNode;
	description?: ReactNode;
	shortcut?: ReactNode;
	/** Marks the option that matches the current value with a check. */
	isCurrent?: boolean;
};

/** A row. The highlight previews it on the content; pass `onFocus` to run the preview. */
export function CommandMenuItem<T extends object>({
	children,
	leading,
	description,
	shortcut,
	isCurrent,
	textValue,
	className,
	...props
}: CommandMenuItemProps<T>) {
	const { classes: slots } = useContext(CommandMenuContext);
	return (
		<ListBoxItem<T>
			{...props}
			textValue={textValue ?? (typeof children === "string" ? children : undefined)}
			data-cui={commandMenuParts.item}
			className={withClasses(className, commandMenuStyles.item(), slots?.item)}
		>
			{leading != null && (
				<span
					aria-hidden="true"
					data-cui={commandMenuParts.leading}
					className={classes(commandMenuStyles.leading(), slots?.leading)}
				>
					{leading}
				</span>
			)}
			<Text
				slot="label"
				data-cui={commandMenuParts.itemLabel}
				className={classes(commandMenuStyles.itemLabel(), slots?.itemLabel)}
			>
				{children}
			</Text>
			{description != null && (
				<Text
					slot="description"
					data-cui={commandMenuParts.itemDescription}
					className={classes(commandMenuStyles.itemDescription(), slots?.itemDescription)}
				>
					{description}
				</Text>
			)}
			{isCurrent && (
				<span
					aria-hidden="true"
					data-cui={commandMenuParts.itemIndicator}
					className={classes(commandMenuStyles.itemIndicator(), slots?.itemIndicator)}
				>
					<CheckIcon />
				</span>
			)}
			{shortcut != null && (
				<kbd
					data-cui={commandMenuParts.shortcut}
					className={classes(commandMenuStyles.shortcut(), slots?.shortcut)}
				>
					{shortcut}
				</kbd>
			)}
		</ListBoxItem>
	);
}
