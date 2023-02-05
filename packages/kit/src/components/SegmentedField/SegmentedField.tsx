import * as styles from "./SegmentedField.css";
import * as InternalSegmentedField from "../../internal/SegmentedField";
import { GetKobalteParams } from "../../utils/types";
import {
	Accessor,
	createContext,
	createEffect,
	createMemo,
	createSignal,
	createUniqueId,
	JSX,
	on,
	splitProps,
	useContext,
} from "solid-js";
import { useFormControlContext } from "@kobalte/core";
import { assignInlineVars } from "@vanilla-extract/dynamic";
import { BaseFieldProps, createBaseFieldProps } from "../Field/createBaseFieldProps";
import { mergeClasses } from "../../utils/css";

interface SegmentedFieldContext {
	value: Accessor<unknown>;

	items: Accessor<{ [key: string]: unknown }>;

	registerItem(itemId: string, value: unknown): void;

	onItemValuePropChange(itemId: string, value: unknown): void;
}

const Context = createContext<SegmentedFieldContext>();

export type SegmentedFieldProps = GetKobalteParams<
	(typeof InternalSegmentedField)["Root"]
> &
	BaseFieldProps & {
		description?: string;
		label?: JSX.Element;
		placeholder?: string;
	};

export function SegmentedField(props: SegmentedFieldProps) {
	const [items, setItems] = createSignal<{ [key: string]: unknown }>({});
	const [value, setValue] = createSignal<unknown>(props.defaultValue);
	const [local, others] = splitProps(props, ["children"]);
	const baseFieldProps = createBaseFieldProps(props);

	return (
		<Context.Provider
			value={{
				value,
				items,
				registerItem(itemId: string, value: unknown) {
					setItems(items => ({ ...items, [itemId]: value }));
				},
				onItemValuePropChange(itemId: string, value: unknown) {
					setItems(items => {
						const o = { ...items };
						o[itemId] = value;
						return o;
					});
				},
			}}
		>
			<InternalSegmentedField.Root
				{...others}
				class={mergeClasses(baseFieldProps.baseStyle(), styles.segmentedGroup)}
				onValueChange={value => {
					others.onValueChange?.(value);
					setValue(() => value);
				}}
			>
				<SegmentedFieldIndicator />
				{local.children}
			</InternalSegmentedField.Root>
		</Context.Provider>
	);
}

export function SegmentedFieldIndicator() {
	const context = useContext(Context)!;

	const segmentWidth = createMemo(
		() => `calc(100% / ${Object.keys(context.items()).length})`,
	);

	const activeIndex = createMemo(() => {
		const items = context.items();
		const value = context.value();
		return Object.values(items).findIndex(itemValue => itemValue === value);
	});

	const activeSegmentOffset = createMemo(
		() => `calc(${segmentWidth()} * ${activeIndex()})`,
	);

	return (
		<InternalSegmentedField.Indicator
			as={"div"}
			class={styles.indicator}
			style={assignInlineVars({
				[styles.segmentedFieldVars.activeSegmentedWidth]: segmentWidth(),
				[styles.segmentedFieldVars.activeSegmentedOffset]: activeSegmentOffset(),
			})}
		/>
	);
}

export function SegmentedFieldItem(
	props: GetKobalteParams<(typeof InternalSegmentedField)["Item"]>,
) {
	const context = useContext(Context)!;
	const id = `${useFormControlContext().name()}-item-${createUniqueId()}`;
	context.registerItem(id, props.value);

	createEffect(
		on(
			() => props.value,
			value => context.onItemValuePropChange(id, value),
			{ defer: true },
		),
	);

	return (
		<InternalSegmentedField.Item {...props} class={styles.segment}>
			<InternalSegmentedField.ItemInput />
			<InternalSegmentedField.ItemControl />
			<InternalSegmentedField.ItemLabel>
				{props.children}
			</InternalSegmentedField.ItemLabel>
		</InternalSegmentedField.Item>
	);
}
