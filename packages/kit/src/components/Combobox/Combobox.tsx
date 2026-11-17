import "@codeui/styles/theme.css";
import "@codeui/styles/combobox.css";
import type { ComboboxRootOptions } from "@kobalte/core/combobox";
import { createComputed, For, type JSX, Show, splitProps } from "solid-js";
import { isServer } from "solid-js/web";
import { CheckIcon } from "../../icons/CheckIcon";
import { SelectorIcon } from "../../icons/SelectorIcon";
import * as P from "../../parts/combobox";
import { mergeClasses } from "../../utils/css";
import type { FieldContent } from "../Field/createBaseFieldProps";
import * as styles from "./Combobox.css";

type DistributiveOmit<T, K extends PropertyKey> = T extends unknown ? Omit<T, K> : never;

export type ComboboxProps<Option, OptGroup = never> = DistributiveOmit<
	ComboboxRootOptions<Option, OptGroup>,
	"itemComponent" | "sectionComponent"
> &
	FieldContent & {
		class?: string;
		classes?: P.ComboboxClasses;
		"aria-label"?: string;
		"aria-labelledby"?: string;
		inputRef?: (element: HTMLInputElement) => void;
		inputId?: string;
		/** Controlled input text, independent of the selected value. */
		inputValue?: string;
		renderOption?: (option: Option) => JSX.Element;
		/** Shown in the list when no option matches the text. */
		emptyContent?: JSX.Element;
		/** Portal target, such as a parent dialog, so the list stays inside it. */
		mount?: HTMLElement;
		size?: "sm" | "md";
	};

function ControlledInputValue(props: {
	value: string | undefined;
	sync: (write: () => void) => void;
}) {
	const context = P.useComboboxContext();
	createComputed(() => {
		const value = props.value;
		if (value !== undefined && value !== context.inputValue()) {
			props.sync(() => context.setInputValue(value));
		}
	});
	return null;
}

function FormValue(props: { name: string; disabled?: boolean }) {
	const context = P.useComboboxContext();
	return (
		<For each={[...context.listState().selectionManager().selectedKeys()]}>
			{key => (
				<input type="hidden" name={props.name} value={key} disabled={props.disabled} />
			)}
		</For>
	);
}

function EmptyContent(props: { children: JSX.Element }) {
	const context = P.useComboboxContext();
	return (
		<Show when={context.listState().collection().getSize() === 0}>
			<div role="presentation" class={styles.empty}>
				{props.children}
			</div>
		</Show>
	);
}

export function Combobox<Option, OptGroup = never>(
	props: ComboboxProps<Option, OptGroup>,
) {
	const [local, others] = splitProps(props as ComboboxProps<Option, OptGroup>, [
		"class",
		"classes",
		"label",
		"description",
		"errorMessage",
		"aria-label",
		"aria-labelledby",
		"inputRef",
		"inputId",
		"inputValue",
		"onInputChange",
		"renderOption",
		"emptyContent",
		"mount",
		"size",
	]);
	const classes = (part: P.ComboboxPart) => local.classes?.[part];
	let syncing = false;
	return (
		<P.Root<Option, OptGroup>
			{...(others as ComboboxRootOptions<Option, OptGroup>)}
			allowsEmptyCollection={
				others.allowsEmptyCollection ?? local.emptyContent !== undefined
			}
			onInputChange={value => {
				if (!syncing) local.onInputChange?.(value);
			}}
			class={mergeClasses(local.class, classes("root"))}
			itemComponent={item => (
				<P.Item item={item.item} class={classes("item")}>
					<P.ItemLabel class={classes("itemLabel")}>
						{local.renderOption
							? local.renderOption(item.item.rawValue)
							: item.item.textValue}
					</P.ItemLabel>
					<P.ItemIndicator class={classes("itemIndicator")}>
						<CheckIcon />
					</P.ItemIndicator>
				</P.Item>
			)}
		>
			<ControlledInputValue
				value={local.inputValue}
				sync={write => {
					syncing = true;
					write();
					syncing = false;
				}}
			/>
			<Show when={local.label}>
				{label => <P.Label class={classes("label")}>{label()}</P.Label>}
			</Show>
			<P.Control size={local.size} class={classes("control")}>
				<P.Input
					{...(isServer && local.inputValue !== undefined
						? { value: local.inputValue }
						: {})}
					ref={local.inputRef}
					id={local.inputId}
					aria-label={local["aria-label"]}
					aria-labelledby={local["aria-labelledby"]}
					class={classes("input")}
				/>
				<P.Trigger class={classes("trigger")}>
					<P.Icon class={classes("icon")}>
						<SelectorIcon />
					</P.Icon>
				</P.Trigger>
			</P.Control>
			<Show when={local.description}>
				{description => (
					<P.Description class={classes("description")}>{description()}</P.Description>
				)}
			</Show>
			<Show when={props.validationState === "invalid" && local.errorMessage}>
				{errorMessage => (
					<P.ErrorMessage class={classes("errorMessage")}>
						{errorMessage()}
					</P.ErrorMessage>
				)}
			</Show>
			<Show when={others.name}>
				{name => <FormValue name={name()} disabled={others.disabled} />}
			</Show>
			<P.Portal mount={local.mount}>
				<P.Content class={classes("content")}>
					<P.Listbox class={classes("listbox")} />
					<Show when={local.emptyContent}>
						{emptyContent => <EmptyContent>{emptyContent()}</EmptyContent>}
					</Show>
				</P.Content>
			</P.Portal>
		</P.Root>
	);
}

export {
	ComboboxParts,
	comboboxStyles,
	createComboboxOptions,
} from "../../parts/combobox";
export type {
	ComboboxClasses,
	ComboboxOption,
	ComboboxOptionsConfig,
	ComboboxPart,
	ComboboxStyles,
	ComboboxVariants,
	CreateComboboxOptionsReturn,
} from "../../parts/combobox";
