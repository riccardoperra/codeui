import { Accessor, JSXElement } from "solid-js";
import { SelectProps } from "./Select";

type Value = any;

interface Option<T = any> {
	label: JSXElement;
	value: T;
}

interface ConfigFor<T> {
	key?: keyof T | string;
	valueKey?: (keyof T & string) | string;
}

type MapOptionToValue<
	T,
	Key extends (keyof T & string) | string | undefined,
> = Key extends keyof T ? T[Key] : T;

interface CreateSelectOptionsReturn<T, C extends ConfigFor<T>> {
	options: Accessor<Array<Option<MapOptionToValue<T, C["valueKey"]>>>>;

	optionToValue(option: Option): MapOptionToValue<T, C["valueKey"]>;

	optionFromValue(
		option: MapOptionToValue<T, C["valueKey"]>,
	): Option<MapOptionToValue<T, C["valueKey"]>> | undefined;

	props(): Record<string, unknown>;

	controlled<Value extends MapOptionToValue<T, C["valueKey"]>>(
		value: Accessor<Value | undefined>,
		onChange: (value: Value | undefined, option: Option<Value> | undefined) => void,
	): {
		value: Option<MapOptionToValue<T, C["valueKey"]>> | undefined;
		onChange: (item: Option<Value>) => void;
	};
}

// TODO should support disabled and nested groups?
export function createSelectOptions<T, C extends ConfigFor<T>>(
	values: readonly T[] | Accessor<readonly T[]>,
	config?: C,
): CreateSelectOptionsReturn<T, C> {
	const internalValue = () => (typeof values === "function" ? values() : values);

	const getValue = (value: Value) =>
		config?.valueKey !== undefined ? value[config.valueKey] : value;

	const getLabel = (value: Value) =>
		config?.key !== undefined ? value[config.key] : value;

	const options = () => {
		const initialValues = internalValue();

		return initialValues.map(value => {
			return {
				label: getLabel(value),
				value: getValue(value),
			};
		});
	};

	const optionToValue = (option?: Option) => {
		if (!option) return undefined;
		return option.value;
	};

	const optionFromValue = (value: MapOptionToValue<T, C["valueKey"]>) => {
		const optionsByValue = options().filter(option => {
			return option.value === value;
		});
		return optionsByValue[0];
	};

	return {
		options,
		optionToValue,
		optionFromValue,
		controlled(value, onChange) {
			return {
				get value() {
					const internalValue = value();
					return internalValue ? optionFromValue(internalValue) : undefined;
				},
				onChange(option) {
					const value = optionToValue(option);
					return onChange(value, option);
				},
			};
		},
		props() {
			return {
				get optionValue() {
					return (config?.valueKey as keyof Option<T>) ?? undefined;
				},
				get optionTextValue() {
					return (config?.key as keyof Option<T>) ?? undefined;
				},
				itemLabel: (option: Option) => option.label,
				valueComponent: (value: Accessor<Option>) => value().label,
			} as Partial<SelectProps<Option<T>>>;
		},
	};
}
