import { HydratablePortal } from "../utils/hydratable-portal";
import "@codeui/styles/theme.css";
import "@codeui/styles/commandmenu.css";
import * as K from "@kobalte/core/combobox";
import {
	Dialog as KDialog,
	useDialogContext,
	type DialogContentProps as KDialogContentProps,
	type DialogOverlayProps as KDialogOverlayProps,
	type DialogPortalProps as KDialogPortalProps,
	type DialogRootProps as KDialogRootProps,
	type DialogTitleProps as KDialogTitleProps,
	type DialogTriggerProps as KDialogTriggerProps,
} from "@kobalte/core/dialog";
import type { PolymorphicProps } from "@kobalte/core/polymorphic";
import {
	type ComponentProps,
	createComputed,
	type JSX,
	onCleanup,
	on,
	onMount,
	type ParentProps,
	Show,
	splitProps,
	untrack,
	type ValidComponent,
} from "solid-js";
import * as styles from "../components/CommandMenu/CommandMenu.css";
import { mergeClasses } from "../utils/css";
import * as Dialog from "./dialog";

import { commandMenuParts, type CommandMenuPart, type CommandMenuClasses, type CommandMenuStyles, commandMenuStyles } from "@codeui/styles/commandmenu";
export { commandMenuParts, type CommandMenuPart, type CommandMenuClasses, type CommandMenuStyles, commandMenuStyles } from "@codeui/styles/commandmenu";
function partAttributes(part: CommandMenuPart, local: { class?: string }) {
	return {
		"data-cui": commandMenuParts[part],
		get class() {
			return mergeClasses(commandMenuStyles[part](), local.class);
		},
	};
}

export type RootProps = KDialogRootProps;
export function Root(props: RootProps) {
	return <KDialog {...props} />;
}

export type PortalProps = KDialogPortalProps;
export function Portal(props: PortalProps) {
	const context = useDialogContext();
	return <Show when={context.contentPresent() || context.overlayPresent()}><HydratablePortal {...props} /></Show>;
}

export type TriggerProps<T extends ValidComponent = "button"> = KDialogTriggerProps<T>;
export function Trigger<T extends ValidComponent = "button">(
	props: PolymorphicProps<T, TriggerProps<T>>,
) {
	const [local, others] = splitProps(props as PolymorphicProps<"button", TriggerProps>, [
		"class",
	]);
	return <Dialog.Trigger {...others} {...partAttributes("trigger", local)} />;
}

export type OverlayProps<T extends ValidComponent = "div"> = KDialogOverlayProps<T>;
export function Overlay<T extends ValidComponent = "div">(
	props: PolymorphicProps<T, OverlayProps<T>>,
) {
	const [local, others] = splitProps(props as PolymorphicProps<"div", OverlayProps>, [
		"class",
	]);
	return <Dialog.Overlay {...others} {...partAttributes("overlay", local)} />;
}

type EngineKeys =
	| "options"
	| "optionValue"
	| "optionTextValue"
	| "optionLabel"
	| "optionDisabled"
	| "optionGroupChildren"
	| "itemComponent"
	| "sectionComponent"
	| "defaultFilter"
	| "onInputChange"
	| "translations"
	| "virtualized"
	| "keyboardDelegate";

/**
 * The combobox engine that drives the search field and the inline list. The
 * list is always shown, so the engine has no open state or popup of its own.
 */
export type EngineProps<Option, OptGroup = never> = Pick<
	K.ComboboxRootOptions<Option, OptGroup>,
	EngineKeys
> & {
	/**
	 * Called with the option under the highlight each time it changes, from the
	 * keyboard or the pointer, and with `undefined` when nothing is highlighted.
	 */
	onHighlightChange?: (option: Option | undefined) => void;
	/** Called when Enter or a click picks an option. */
	onSelect?: (option: Option) => void;
};

const engineKeys = [
	"options",
	"optionValue",
	"optionTextValue",
	"optionLabel",
	"optionDisabled",
	"optionGroupChildren",
	"itemComponent",
	"sectionComponent",
	"defaultFilter",
	"onInputChange",
	"translations",
	"virtualized",
	"keyboardDelegate",
	"onHighlightChange",
	"onSelect",
] as const;

export type ContentProps<Option, OptGroup = never> = Omit<
	KDialogContentProps,
	"children"
> &
	EngineProps<Option, OptGroup> & { class?: string; children?: JSX.Element };

function Passthrough(props: ParentProps) {
	return <>{props.children}</>;
}

function HighlightAdapter<Option>(props: {
	onHighlightChange?: (option: Option | undefined) => void;
}) {
	const context = K.useComboboxContext();
	const manager = () => context.listState().selectionManager();
	let reported: Option | undefined;
	const report = (option: Option | undefined) => {
		if (option === reported) return;
		reported = option;
		props.onHighlightChange?.(option);
	};
	createComputed(() => {
		const key = manager().focusedKey();
		const node = key == null ? undefined : context.listState().collection().getItem(key);
		const option = node?.type === "item" ? (node.rawValue as Option) : undefined;
		untrack(() => report(option));
	});
	onMount(() => highlightFirst(context));
	createComputed(
		on(
			context.inputValue,
			// The engine clears the highlight right after the query changes.
			() => queueMicrotask(() => highlightFirst(context)),
			{ defer: true },
		),
	);
	onCleanup(() => report(undefined));
	return null;
}

function highlightFirst(context: K.ComboboxContextValue) {
	const manager = context.listState().selectionManager();
	manager.setFocused(true);
	manager.setFocusedKey(context.keyboardDelegate().getFirstKey?.());
}

/**
 * The dialog panel. It hosts the combobox engine, so the search field and
 * the list inside share one highlight. The highlight starts on the first
 * enabled option and moves back to it whenever the query changes.
 */
export function Content<Option, OptGroup = never>(props: ContentProps<Option, OptGroup>) {
	const [engine, local, others] = splitProps(props, engineKeys, ["class", "children"]);
	return (
		<Dialog.Content {...others} {...partAttributes("content", local)}>
			<K.Root<Option, OptGroup, typeof Passthrough>
				as={Passthrough}
				options={engine.options}
				optionValue={engine.optionValue}
				optionTextValue={engine.optionTextValue}
				optionLabel={engine.optionLabel}
				optionDisabled={engine.optionDisabled}
				optionGroupChildren={engine.optionGroupChildren}
				itemComponent={engine.itemComponent}
				sectionComponent={engine.sectionComponent}
				defaultFilter={engine.defaultFilter}
				translations={engine.translations}
				virtualized={engine.virtualized}
				keyboardDelegate={engine.keyboardDelegate}
				open
				value={null}
				closeOnSelection={false}
				noResetInputOnBlur
				allowsEmptyCollection
				shouldFocusWrap
				onInputChange={engine.onInputChange}
				onChange={option => {
					if (option != null) engine.onSelect?.(option);
				}}
			>
				<HighlightAdapter<Option> onHighlightChange={engine.onHighlightChange} />
				{local.children}
			</K.Root>
		</Dialog.Content>
	);
}

export type TitleProps<T extends ValidComponent = "h2"> = KDialogTitleProps<T>;
export function Title<T extends ValidComponent = "h2">(
	props: PolymorphicProps<T, TitleProps<T>>,
) {
	const [local, others] = splitProps(props as PolymorphicProps<"h2", TitleProps>, [
		"class",
	]);
	return <Dialog.Title {...others} {...partAttributes("title", local)} />;
}

export type SearchProps = ComponentProps<"div">;
/** The field around the search input, its icon and the key hint. */
export function Search(props: SearchProps) {
	const [local, others] = splitProps(props, ["class"]);
	return <div {...others} {...partAttributes("search", local)} />;
}

export type SearchInputProps<T extends ValidComponent = "input"> =
	K.ComboboxInputProps<T>;
export function SearchInput<T extends ValidComponent = "input">(
	props: PolymorphicProps<T, SearchInputProps<T>>,
) {
	const [local, others] = splitProps(
		props as PolymorphicProps<"input", SearchInputProps>,
		["class"],
	);
	return (
		<K.Input
			autocomplete="off"
			spellcheck={false}
			{...others}
			{...partAttributes("searchInput", local)}
		/>
	);
}

export type HintProps = ComponentProps<"span">;
/** Key hints such as "↑↓ preview · ↵ apply · esc cancel". Hidden on phones. */
export function Hint(props: HintProps) {
	const [local, others] = splitProps(props, ["class"]);
	return <span aria-hidden="true" {...others} {...partAttributes("hint", local)} />;
}

export type ListboxProps<
	Option = unknown,
	OptGroup = never,
	T extends ValidComponent = "ul",
> = K.ComboboxListboxProps<Option, OptGroup, T>;
export function Listbox<
	Option = unknown,
	OptGroup = never,
	T extends ValidComponent = "ul",
>(props: PolymorphicProps<T, ListboxProps<Option, OptGroup, T>>) {
	const [local, others] = splitProps(
		props as PolymorphicProps<"ul", ListboxProps<Option, OptGroup>>,
		["class"],
	);
	return (
		<K.Listbox<Option, OptGroup> {...others} {...partAttributes("listbox", local)} />
	);
}

export type GroupProps<T extends ValidComponent = "li"> = K.ComboboxSectionProps<T>;
/** The heading row that starts a group of options. */
export function Group<T extends ValidComponent = "li">(
	props: PolymorphicProps<T, GroupProps<T>>,
) {
	const [local, others] = splitProps(props as PolymorphicProps<"li", GroupProps>, [
		"class",
	]);
	return <K.Section {...others} {...partAttributes("group", local)} />;
}

export type GroupLabelProps = ComponentProps<"span">;
export function GroupLabel(props: GroupLabelProps) {
	const [local, others] = splitProps(props, ["class"]);
	return <span {...others} {...partAttributes("groupLabel", local)} />;
}

export type ItemProps<T extends ValidComponent = "li"> = K.ComboboxItemProps<T>;
export function Item<T extends ValidComponent = "li">(
	props: PolymorphicProps<T, ItemProps<T>>,
) {
	const [local, others] = splitProps(props as PolymorphicProps<"li", ItemProps>, [
		"class",
	]);
	return <K.Item {...others} {...partAttributes("item", local)} />;
}

export type LeadingProps = ComponentProps<"span">;
/** A fixed box before the label, so labels line up with or without a visual. */
export function Leading(props: LeadingProps) {
	const [local, others] = splitProps(props, ["class"]);
	return <span aria-hidden="true" {...others} {...partAttributes("leading", local)} />;
}

export type ItemLabelProps<T extends ValidComponent = "div"> =
	K.ComboboxItemLabelProps<T>;
export function ItemLabel<T extends ValidComponent = "div">(
	props: PolymorphicProps<T, ItemLabelProps<T>>,
) {
	const [local, others] = splitProps(props as PolymorphicProps<"div", ItemLabelProps>, [
		"class",
	]);
	return <K.ItemLabel {...others} {...partAttributes("itemLabel", local)} />;
}

export type ItemDescriptionProps<T extends ValidComponent = "div"> =
	K.ComboboxItemDescriptionProps<T>;
export function ItemDescription<T extends ValidComponent = "div">(
	props: PolymorphicProps<T, ItemDescriptionProps<T>>,
) {
	const [local, others] = splitProps(
		props as PolymorphicProps<"div", ItemDescriptionProps>,
		["class"],
	);
	return <K.ItemDescription {...others} {...partAttributes("itemDescription", local)} />;
}

export type ItemIndicatorProps<T extends ValidComponent = "div"> =
	K.ComboboxItemIndicatorProps<T>;
/** Pass `forceMount` to mark an option as current; the menu never keeps a selection. */
export function ItemIndicator<T extends ValidComponent = "div">(
	props: PolymorphicProps<T, ItemIndicatorProps<T>>,
) {
	const [local, others] = splitProps(
		props as PolymorphicProps<"div", ItemIndicatorProps>,
		["class"],
	);
	return <K.ItemIndicator {...others} {...partAttributes("itemIndicator", local)} />;
}

export type ShortcutProps = ComponentProps<"span">;
export function Shortcut(props: ShortcutProps) {
	const [local, others] = splitProps(props, ["class"]);
	return <span {...others} {...partAttributes("shortcut", local)} />;
}

export type EmptyProps = ComponentProps<"div">;
/** Rendered only while no option matches the query. */
export function Empty(props: EmptyProps) {
	const [local, others] = splitProps(props, ["class"]);
	const context = K.useComboboxContext();
	return (
		<Show when={context.listState().collection().getSize() === 0}>
			<div role="status" {...others} {...partAttributes("empty", local)} />
		</Show>
	);
}

export { useComboboxContext as useCommandMenuContext } from "@kobalte/core/combobox";

export const CommandMenuParts = {
	Root,
	Trigger,
	Portal,
	Overlay,
	Content,
	Title,
	Search,
	SearchInput,
	Hint,
	Listbox,
	Group,
	GroupLabel,
	Item,
	Leading,
	ItemLabel,
	ItemDescription,
	ItemIndicator,
	Shortcut,
	Empty,
};
