import type { DialogContentProps } from "@kobalte/core/dialog";
import {
	createComputed,
	createMemo,
	createSignal,
	createUniqueId,
	type JSX,
	on,
	Show,
} from "solid-js";
import { CheckIcon } from "../../icons/CheckIcon";
import * as P from "../../parts/command-menu";
import { mergeClasses } from "../../utils/css";

export type CommandItem = {
	/** Unique across the items. */
	id: string;
	/** The plain text the default filter searches. */
	textValue: string;
	label: JSX.Element;
	description?: JSX.Element;
	/** A visual before the label, such as an icon or a theme swatch. */
	leading?: JSX.Element;
	shortcut?: JSX.Element;
	/** Consecutive items with the same group and section share a heading. */
	group?: string;
	section?: string;
	disabled?: boolean;
	/** Marks the item that matches the current value with a check. */
	current?: boolean;
};

export type CommandMenuProps<T extends CommandItem> = {
	class?: string;
	classes?: P.CommandMenuClasses;
	open: boolean;
	onOpenChange: (open: boolean) => void;
	items: readonly T[];
	/** The accessible name of the dialog, the search field and the list. Not shown. */
	title: JSX.Element;
	placeholder?: string;
	/** Key hints shown at the end of the search field, such as "↑↓ preview · ↵ apply · esc cancel". */
	hint?: JSX.Element;
	query?: string;
	onQueryChange?: (query: string) => void;
	/** Replaces the default filter, which matches every word of the query. */
	filter?: (items: readonly T[], query: string) => readonly T[];
	/** The highlighted item, from the arrows or the pointer. Use it to preview. */
	onHighlightChange?: (item: T | undefined) => void;
	/** Enter or a click. Runs after the menu closes. */
	onSelect: (item: T) => void;
	/** Runs first on every close, before `onOpenChange`. Use it to end a preview. */
	onBeforeClose?: () => void;
	/** Escape, a click outside or a programmatic close without a selection. */
	onCancel?: () => void;
	onCloseAutoFocus?: DialogContentProps["onCloseAutoFocus"];
	emptyContent?: JSX.Element;
	/** Portal target. Defaults to the document body. */
	mount?: HTMLElement;
};

type CommandGroup<T extends CommandItem> = {
	key: string;
	group?: string;
	section?: string;
	leading: boolean;
	items: T[];
};

function haystack(item: CommandItem) {
	const description = typeof item.description === "string" ? item.description : "";
	return [item.textValue, item.group, item.section, description].join(" ").toLowerCase();
}

/** Keeps the items whose text, group, section or plain-text description contain every word of the query. */
export function filterCommandItems<T extends CommandItem>(
	items: readonly T[],
	query: string,
) {
	const words = query.toLowerCase().split(/\s+/).filter(Boolean);
	if (words.length === 0) return items;
	return items.filter(item => {
		const text = haystack(item);
		return words.every(word => text.includes(word));
	});
}

function groupItems<T extends CommandItem>(items: readonly T[]) {
	const ids = new Set<string>();
	const groups: CommandGroup<T>[] = [];
	for (const item of items) {
		if (ids.has(item.id))
			throw new Error(`[codeui] CommandMenu item id "${item.id}" is not unique`);
		ids.add(item.id);
		const last = groups.at(-1);
		if (last && last.group === item.group && last.section === item.section) {
			last.items.push(item);
			last.leading ||= item.leading != null;
			continue;
		}
		groups.push({
			key: `group:${groups.length}`,
			group: item.group,
			section: item.section,
			leading: item.leading != null,
			items: [item],
		});
	}
	return groups;
}

function SearchIcon() {
	return (
		<svg
			width="16"
			height="16"
			viewBox="0 0 16 16"
			fill="none"
			stroke="currentColor"
			stroke-width="1.5"
			stroke-linecap="round"
			aria-hidden="true"
		>
			<circle cx="7" cy="7" r="4.25" />
			<path d="m10.25 10.25 3.25 3.25" />
		</svg>
	);
}

function ControlledQuery(props: { value: string | undefined }) {
	const context = P.useCommandMenuContext();
	createComputed(() => {
		const value = props.value;
		if (value !== undefined && value !== context.inputValue())
			context.setInputValue(value);
	});
	return null;
}

/**
 * A searchable list of commands in a dialog, for a shortcut such as Cmd+K
 * that the app binds. Moving the highlight previews through
 * `onHighlightChange`; only Enter or a click calls `onSelect`. It opens and
 * closes without animation, focuses the search on open, gives focus back on
 * close and starts every open with an empty query.
 */
export function CommandMenu<T extends CommandItem>(props: CommandMenuProps<T>) {
	const classes = (part: P.CommandMenuPart) => props.classes?.[part];
	const titleId = createUniqueId();
	const [ownQuery, setOwnQuery] = createSignal("");
	const query = () => props.query ?? ownQuery();
	const groups = createMemo(() =>
		groupItems((props.filter ?? filterCommandItems)(props.items, query())),
	);
	const hasLeading = createMemo(
		() => new Set(groups().flatMap(group => (group.leading ? group.items : []))),
	);
	let closing = false;

	const end = (selected?: T) => {
		props.onBeforeClose?.();
		if (!selected) props.onCancel?.();
		setOwnQuery("");
		if (props.query) props.onQueryChange?.("");
	};
	const close = (selected?: T) => {
		closing = true;
		end(selected);
		props.onOpenChange(false);
		closing = false;
		if (selected) props.onSelect(selected);
	};
	createComputed(
		on(
			() => props.open,
			(open, wasOpen) => {
				if (wasOpen && !open && !closing) end();
			},
			{ defer: true },
		),
	);

	return (
		<P.Root
			open={props.open}
			onOpenChange={open => (open ? props.onOpenChange(true) : close())}
		>
			<P.Portal mount={props.mount}>
				<P.Content<T, CommandGroup<T>>
					class={mergeClasses(props.class, classes("content"))}
					aria-labelledby={titleId}
					options={groups()}
					optionValue="id"
					optionTextValue="textValue"
					optionDisabled="disabled"
					optionGroupChildren="items"
					defaultFilter={() => true}
					onInputChange={value => {
						setOwnQuery(value);
						props.onQueryChange?.(value);
					}}
					onHighlightChange={item => props.onHighlightChange?.(item)}
					onSelect={close}
					onCloseAutoFocus={props.onCloseAutoFocus}
					sectionComponent={node => (
						<Show when={node.section.rawValue.group}>
							{group => (
								<P.Group class={classes("group")}>
									<P.GroupLabel class={classes("groupLabel")}>
										<Show
											when={
												node.section.rawValue.section !== group() &&
												node.section.rawValue.section
											}
										>
											{section => `${section()} / `}
										</Show>
										{group()}
									</P.GroupLabel>
								</P.Group>
							)}
						</Show>
					)}
					itemComponent={node => {
						const item = node.item.rawValue;
						return (
							<P.Item item={node.item} class={classes("item")}>
								<Show when={hasLeading().has(item)}>
									<P.Leading class={classes("leading")}>{item.leading}</P.Leading>
								</Show>
								<P.ItemLabel class={classes("itemLabel")}>{item.label}</P.ItemLabel>
								<Show when={item.description}>
									<P.ItemDescription class={classes("itemDescription")}>
										{item.description}
									</P.ItemDescription>
								</Show>
								<Show when={item.current}>
									<P.ItemIndicator forceMount class={classes("itemIndicator")}>
										<CheckIcon />
									</P.ItemIndicator>
								</Show>
								<Show when={item.shortcut}>
									<P.Shortcut class={classes("shortcut")}>{item.shortcut}</P.Shortcut>
								</Show>
							</P.Item>
						);
					}}
				>
					<ControlledQuery value={props.query} />
					<P.Title id={titleId} class={classes("title")}>
						{props.title}
					</P.Title>
					<P.Search class={classes("search")}>
						<SearchIcon />
						<P.SearchInput
							aria-labelledby={titleId}
							placeholder={props.placeholder}
							class={classes("searchInput")}
						/>
						<Show when={props.hint}>
							{hint => <P.Hint class={classes("hint")}>{hint()}</P.Hint>}
						</Show>
					</P.Search>
					<P.Listbox aria-labelledby={titleId} class={classes("listbox")} />
					<Show when={props.emptyContent}>
						{emptyContent => <P.Empty class={classes("empty")}>{emptyContent()}</P.Empty>}
					</Show>
				</P.Content>
			</P.Portal>
		</P.Root>
	);
}

export { CommandMenuParts, commandMenuStyles } from "../../parts/command-menu";
export type {
	CommandMenuClasses,
	CommandMenuPart,
	CommandMenuStyles,
} from "../../parts/command-menu";
