import { TextField as KTextField } from "@kobalte/core";
import { TextFieldRootOptions } from "@kobalte/core/dist/types/text-field";
import {
	maskitoCaretGuard,
	maskitoNumberOptionsGenerator,
	maskitoParseNumber,
} from "@maskito/kit";
import { createControllableSignal } from "@kobalte/core";
import { JSX, mergeProps, onMount, Ref, Show, splitProps } from "solid-js";
import { SlotProp } from "../../utils/component";
import { mergeClasses } from "../../utils/css";
import { createMaskito } from "../../utils/maskito";
import { BaseFieldProps, createBaseFieldProps } from "../Field/createBaseFieldProps";
import {
	createFieldErrorMessageProps,
	FieldWithErrorMessageSupport,
} from "../Field/FieldError/createFieldErrorMessageProps";
import * as styles from "./NumberField.css";
import { NumberFieldLabel } from "./NumberFieldLabel";
import { NumberFieldMessage } from "./NumberFieldMessage";

// TODO: add to base field slot that respect the BaseFieldProps signature?
type TextFieldSlot = "root" | "input" | "label" | "errorLabel";

export const TUI_DECIMAL_SYMBOLS: readonly string[] = [`,`, `.`];

/**
 * Clamps a value between two inclusive limits
 *
 * @param value
 * @param min lower limit
 * @param max upper limit
 */
export function clamp(value: number, min: number, max: number): number {
	// isDev && tuiAssert.assert(!Number.isNaN(value));
	// isDev && tuiAssert.assert(!Number.isNaN(min));
	// isDev && tuiAssert.assert(!Number.isNaN(max));
	// isDev && tuiAssert.assert(max >= min);
	//
	return Math.min(max, Math.max(min, value));
}

export interface InputNumberOptions {
	readonly min: number;
	readonly max: number;
	readonly step: number;
	readonly precision: number;
	readonly prefix: string;
	readonly postfix: string;
}

export type Rounding = "ceil" | "floor" | "round" | "truncate";

export interface NumberFormatSettings {
	/**
	 * Number of digits of decimal part.
	 * @note Use `Infinity` to keep untouched.
	 */
	readonly decimalLimit: number;
	/**
	 * Separator between the integer and the decimal part.
	 * @example 0,42 (',' by default)
	 */
	readonly decimalSeparator: string;
	/**
	 * Separator between thousands.
	 * @example 360 000 (' ' by default)
	 */
	readonly thousandSeparator: string;
	/**
	 * Enable zeros at the end of decimal part.
	 */
	readonly zeroPadding: boolean;
	/**
	 * Rounding method.
	 */
	readonly rounding: Rounding;
}

/**
 * TODO FIX
 */
export const defaultNumberFormat: NumberFormatSettings = {
	decimalLimit: Infinity,
	decimalSeparator: `,`,
	thousandSeparator: "\u00A0",
	zeroPadding: true,
	rounding: `truncate`,
};

type NumberFieldRootOptions = Omit<
	TextFieldRootOptions,
	"value" | "defaultValue" | "onChange"
> & {
	value?: number;
	defaultValue?: number;
	onChange?: (value: number | undefined) => void;
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

const defaultOptions: InputNumberOptions = {
	min: Number.MIN_SAFE_INTEGER,
	max: Number.MAX_SAFE_INTEGER,
	step: 1,
	precision: 2,
	prefix: "",
	postfix: "",
};

export function NumberField(props: NumberFieldProps) {
	const [local, options, state, others] = splitProps(
		props,
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

	const [value, setValue] = createControllableSignal<number | undefined>({
		value: () => state.value,
		defaultValue: () => state.defaultValue,
		onChange: value => {
			state.onChange?.(value);
		},
	});

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

	// TODO: fix
	onMount(() => mask(local.ref as any));

	const computeMin = () => {
		return Math.min(optionsWithDefault.min, optionsWithDefault.max);
	};

	const computeMax = () => {
		return Math.max(optionsWithDefault.min, optionsWithDefault.max);
	};

	const onKeyDown = (event: KeyboardEvent) => {
		if (!(event.key === "ArrowDown" || event.key === "ArrowUp")) {
			return;
		}
		event.preventDefault();
		event.stopImmediatePropagation();

		if (!optionsWithDefault.step) {
			return;
		}

		const step =
			event.key === "ArrowDown" ? -optionsWithDefault.step : optionsWithDefault.step;

		setValue((value() || 0) + step);
	};

	const onValueChange = (nativeValue: string) => {
		const parsedValue = maskitoParseNumber(
			nativeValue,
			defaultNumberFormat.decimalSeparator,
		);

		if (Number.isNaN(parsedValue)) {
			setValue(undefined);
			return;
		}

		if (parsedValue < computeMin() || parsedValue > computeMax()) {
			return;
		}

		setValue(parsedValue);
	};

	return (
		<KTextField.Root
			data-cui={"number-field"}
			data-field-size={local.size}
			class={mergeClasses(styles.baseFieldContainer, local?.slotClasses?.root)}
			value={value() as unknown as string}
			onChange={onValueChange}
			{...others}
		>
			<Show when={local.label} keyed={false}>
				<NumberFieldLabel class={local.slotClasses?.label}>
					{local.label}
				</NumberFieldLabel>
			</Show>
			<KTextField.Input
				class={inputClasses()}
				placeholder={local.placeholder}
				ref={local.ref}
				type={"text"}
				onKeyDown={onKeyDown}
			/>
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
