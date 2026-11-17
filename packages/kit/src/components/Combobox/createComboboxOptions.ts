import type { Accessor } from "solid-js";

type KeysOfType<T, V> = { [K in keyof T]-?: T[K] extends V ? K : never }[keyof T];

/** One normalized option. `label` is the string the input shows and filters by. */
export interface ComboboxOption<Value, Item = Value> {
	value: Value;
	label: string;
	disabled: boolean;
	item: Item;
}

export interface ComboboxOptionsConfig<T> {
	valueKey: KeysOfType<T, string | number>;
	labelKey: KeysOfType<T, string>;
	disabledKey?: KeysOfType<T, boolean | undefined>;
}

export interface CreateComboboxOptionsReturn<Value, Item> {
	options: Accessor<ComboboxOption<Value, Item>[]>;
	optionToValue(
		option: ComboboxOption<Value, Item> | null | undefined,
	): Value | undefined;
	optionFromValue(
		value: Value | null | undefined,
	): ComboboxOption<Value, Item> | undefined;
	/** Spread on a Combobox root: options and the keys Kobalte reads from each option. */
	props(): {
		options: ComboboxOption<Value, Item>[];
		optionValue: "value";
		optionTextValue: "label";
		optionLabel: "label";
		optionDisabled: "disabled";
	};
	controlled(
		value: Accessor<Value | null | undefined>,
		onChange: (
			value: Value | undefined,
			option: ComboboxOption<Value, Item> | undefined,
		) => void,
	): {
		value: ComboboxOption<Value, Item> | null;
		onChange: (option: ComboboxOption<Value, Item> | null) => void;
	};
}

type Source<T> = readonly T[] | Accessor<readonly T[]>;

export function createComboboxOptions<T extends string | number>(
	values: Source<T>,
): CreateComboboxOptionsReturn<T, T>;
export function createComboboxOptions<
	T extends object,
	C extends ComboboxOptionsConfig<T>,
>(values: Source<T>, config: C): CreateComboboxOptionsReturn<T[C["valueKey"]], T>;
export function createComboboxOptions(
	values: Source<any>,
	config?: ComboboxOptionsConfig<any>,
): CreateComboboxOptionsReturn<unknown, unknown> {
	const read = () => (typeof values === "function" ? values() : values);
	const toOption = (item: any): ComboboxOption<unknown, unknown> =>
		config
			? {
					value: item[config.valueKey],
					label: item[config.labelKey],
					disabled: config.disabledKey ? Boolean(item[config.disabledKey]) : false,
					item,
				}
			: { value: item, label: String(item), disabled: false, item };
	let source: readonly unknown[] | undefined;
	let normalized: ComboboxOption<unknown, unknown>[] = [];
	const options = () => {
		const next = read();
		if (next !== source) {
			source = next;
			normalized = next.map(toOption);
		}
		return normalized;
	};
	const optionFromValue = (value: unknown) =>
		value == null ? undefined : options().find(option => option.value === value);
	const optionToValue = (option: ComboboxOption<unknown, unknown> | null | undefined) =>
		option?.value;
	return {
		options,
		optionToValue,
		optionFromValue,
		props: () => ({
			get options() {
				return options();
			},
			optionValue: "value",
			optionTextValue: "label",
			optionLabel: "label",
			optionDisabled: "disabled",
		}),
		controlled: (value, onChange) => ({
			get value() {
				return optionFromValue(value()) ?? null;
			},
			onChange: option => onChange(optionToValue(option), option ?? undefined),
		}),
	};
}
