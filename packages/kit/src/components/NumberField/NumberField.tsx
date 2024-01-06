import { createControllableSignal, TextField as KTextField } from "@kobalte/core";
import { clamp, isNumber, mergeRefs } from "@kobalte/utils";
import {
	maskitoCaretGuard,
	maskitoNumberOptionsGenerator,
	maskitoParseNumber,
} from "@maskito/kit";
import {
	createEffect,
	createSignal,
	JSX,
	mergeProps,
	onMount,
	Ref,
	Show,
	splitProps,
} from "solid-js";
import { SlotProp } from "../../utils/component";
import { mergeClasses } from "../../utils/css";
import { createMaskito } from "../../utils/maskito";
import { BaseFieldProps, createBaseFieldProps } from "../Field/createBaseFieldProps";
import {
	createFieldErrorMessageProps,
	FieldWithErrorMessageSupport,
} from "../Field/FieldError/createFieldErrorMessageProps";
import { tuiFormatNumber } from "./formatNumber";
import * as styles from "./NumberField.css";
import { NumberFieldControls } from "./NumberFieldControls";
import { NumberFieldLabel } from "./NumberFieldLabel";
import { NumberFieldMessage } from "./NumberFieldMessage";
import type { InputNumberOptions } from "./options";
import { defaultNumberFormat, INPUT_NUMBER_OPTIONS as defaultOptions } from "./options";
import { CHAR_HYPHEN, CHAR_MINUS } from "./unicodeCharacters";

// TODO: add to base field slot that respect the BaseFieldProps signature?
type TextFieldSlot = "root" | "input" | "label" | "errorLabel";

type NumberFieldRootOptions = Omit<
	KTextField.TextFieldRootOptions,
	"value" | "defaultValue" | "onChange"
> & {
	value?: number | null;
	defaultValue?: number;
	onChange?: (value: number | undefined | null) => void;
};

export type NumberFieldProps = NumberFieldRootOptions &
	BaseFieldProps &
	FieldWithErrorMessageSupport & {
		description?: string;
		label?: JSX.Element;
		placeholder?: string;
		ref?: Ref<HTMLInputElement>;
	} & SlotProp<TextFieldSlot> &
	Partial<InputNumberOptions>;

export function NumberField(props: NumberFieldProps) {
	const [local, options, state, others] = splitProps(
		mergeProps({ size: "md" }, props),
		[
			"description",
			"size",
			"label",
			"theme",
			"errorMessage",
			"placeholder",
			"ref",
			"slotClasses",
		],
		["min", "max", "step", "precision", "prefix", "postfix"],
		["value", "onChange", "defaultValue"],
	);

	const [focused, setFocused] = createSignal(false);
	const [forcedChange, forceChange] = createSignal<true>(true, { equals: false });
	const [value, setValue] = createControllableSignal<number | undefined | null>({
		value: () => state.value,
		defaultValue: () => state.defaultValue,
		onChange: value => {
			state.onChange?.(value);
		},
	});
	const [unfinishedValue, setUnfinishedValue] = createSignal("" as string | null);
	let internalRef: HTMLInputElement;

	const optionsWithDefault = mergeProps(defaultOptions, options);
	const baseFieldProps = createBaseFieldProps(props);
	const errorMessageProps = createFieldErrorMessageProps(props);

	const inputClasses = () =>
		mergeClasses(baseFieldProps.baseStyle(), styles.textField, local.slotClasses?.input);

	const mask = createMaskito({
		options: () => {
			const { plugins, ...options } = maskitoNumberOptionsGenerator({
				decimalSeparator: defaultNumberFormat.decimalSeparator,
				thousandSeparator: defaultNumberFormat.thousandSeparator,
				min: optionsWithDefault.min,
				max: optionsWithDefault.max,
				precision: optionsWithDefault.precision,
				prefix: optionsWithDefault.prefix,
				postfix: optionsWithDefault.postfix,
				decimalZeroPadding: true, // TODO: decimalMode === 'always'
			});
			return {
				...options,
				plugins: [
					...plugins,
					maskitoCaretGuard(value => ["".length, value.length - "".length]),
				],
			};
		},
	});

	onMount(() => mask(local.ref as any));

	const displayValue = () => {
		const isFocused = focused();
		const dirtyValue = unfinishedValue();
		const sanitizedValue = value();
		const newValue = isFocused ? dirtyValue : sanitizedValue || null;
		return newValue ? String(newValue) : undefined;
	};

	const computeMin = () => {
		return Math.min(optionsWithDefault.min, optionsWithDefault.max);
	};

	const computeMax = () => {
		return Math.max(optionsWithDefault.min, optionsWithDefault.max);
	};
	const nativeValue = () => internalRef?.value || "";
	const nativeNumberValue = () =>
		maskitoParseNumber(nativeValue(), defaultNumberFormat.decimalSeparator);

	const setNativeValue = (value: string) => (internalRef.value = value);

	const onKeyDown = (event: KeyboardEvent) => {
		if (!(event.key === "ArrowDown" || event.key === "ArrowUp")) {
			return;
		}
		event.preventDefault();
		if (event.key === "ArrowDown") {
			decrement();
		} else {
			increment();
		}
		setNativeValue(formattedValue());
	};

	const increment = () => {
		updateValue((value() || 0) + optionsWithDefault.step);
	};

	const decrement = () => {
		updateValue((value() || 0) - optionsWithDefault.step);
	};

	const updateValue = (value: number, clampValue: boolean = true) => {
		const newValue = clampValue ? clamp(value || 0, computeMin(), computeMax()) : value;
		setValue(newValue);
		setNativeValue(formattedValue());
	};

	const onValueChange = (nativeValue: string) => {
		const parsedValue = maskitoParseNumber(
			nativeValue,
			defaultNumberFormat.decimalSeparator,
		);

		let value: number | undefined = undefined;

		setUnfinishedValue(null);

		if (Number.isNaN(parsedValue)) {
			value = undefined;
			setUnfinishedValue("");
			return;
		} else {
			if (focused()) {
				setUnfinishedValue(nativeValue);
				updateValue(parsedValue, false);
			} else {
				updateValue(parsedValue);
				setUnfinishedValue(nativeValue);
			}
		}
	};

	const formattedValue = (): string => {
		if (value() === null) {
			return "";
		}
		const currentValue = value() || 0;
		const hasFraction = Math.abs(currentValue) % 1 > 0;
		let decimalLimit = hasFraction ? optionsWithDefault.precision : 0;

		// add focused
		return (
			optionsWithDefault.prefix +
			tuiFormatNumber(currentValue, {
				...defaultNumberFormat,
				decimalLimit,
			}).replace(CHAR_HYPHEN, CHAR_MINUS) +
			optionsWithDefault.postfix
		);
	};

	const onFocused = (focused: boolean) => {
		setFocused(focused);

		const nativeNumber = unfinishedValue()
			? maskitoParseNumber(unfinishedValue()!, defaultNumberFormat.decimalSeparator)
			: nativeNumberValue();

		if (Number.isNaN(nativeNumber)) {
			setNativeValue(
				focused ? optionsWithDefault.prefix + optionsWithDefault.postfix : "",
			);
			setUnfinishedValue(null);
			setValue(null);
			return;
		}

		if (!focused) {
			updateValue(nativeNumber);
			setUnfinishedValue(String(nativeNumber));
		}

		setNativeValue(formattedValue());
	};

	return (
		<KTextField.Root
			data-cui={"number-field"}
			data-field-size={local.size ?? "md"}
			class={mergeClasses(styles.baseFieldContainer, local?.slotClasses?.root)}
			value={displayValue()}
			onChange={onValueChange}
			{...others}
		>
			<Show when={local.label} keyed={false}>
				<NumberFieldLabel class={local.slotClasses?.label}>
					{local.label}
				</NumberFieldLabel>
			</Show>

			<div class={styles.numberFieldContainer}>
				<KTextField.Input
					class={inputClasses()}
					placeholder={local.placeholder}
					ref={mergeRefs(local.ref, el => (internalRef = el))}
					type={"text"}
					onKeyDown={onKeyDown}
					onBlur={() => onFocused(false)}
					onFocus={() => onFocused(true)}
				/>

				<NumberFieldControls
					increment={increment}
					decrement={decrement}
					step={optionsWithDefault.step}
				/>
			</div>

			<Show when={local.description} keyed={false}>
				<NumberFieldMessage>{local.description}</NumberFieldMessage>
			</Show>

			<Show when={errorMessageProps.errorMessage} keyed={false}>
				<KTextField.ErrorMessage
					class={mergeClasses(errorMessageProps.class, local.slotClasses?.errorLabel)}
				>
					{local.errorMessage}
				</KTextField.ErrorMessage>
			</Show>
		</KTextField.Root>
	);
}

export { NumberFieldLabel } from "./NumberFieldLabel";
