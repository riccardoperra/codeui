import { Accessor, JSXElement } from "solid-js";
import { SelectProps } from "./Select";

type Value = any;

interface Option<T = any> {
	label: JSXElement;
	value: T;
}

interface ConfigFor<T> {
	key?: string;
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
}

export function createSelectOptions<T, C extends ConfigFor<T>>(
	values: readonly T[],
	config?: C,
): CreateSelectOptionsReturn<T, C> {
	const optionToValue = (option: Option) => getValue(option.value);

	const getValue = (value: Value) =>
		config?.valueKey !== undefined ? value[config.valueKey] : value;

	const getLabel = (value: Value) =>
		config?.key !== undefined ? value[config.key] : value;

	const options = () => {
		const initialValues = values;

		return initialValues.map(value => {
			return {
				label: getLabel(value),
				value: getValue(value),
			};
		});
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
			} satisfies Partial<SelectProps<Option<T>>>;
		},
	};
}
