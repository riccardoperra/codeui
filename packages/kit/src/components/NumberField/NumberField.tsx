import { createControllableSignal, TextField as KTextField } from "@kobalte/core";
import { clamp, isNumber, mergeRefs } from "@kobalte/utils";
import {
	maskitoCaretGuard,
	maskitoNumberOptionsGenerator,
	maskitoParseNumber,
} from "@maskito/kit";
import {
	createEffect,
	JSX,
	mergeProps,
	on,
	onMount,
	Ref,
	Show,
	splitProps,
} from "solid-js";
import { ChevronDownIcon } from "../../icons/ChevronDownIcon";
import { ChevronUpIcon } from "../../icons/ChevronUpIcon";
import { SlotProp } from "../../utils/component";
import { mergeClasses } from "../../utils/css";
import { createMaskito } from "../../utils/maskito";
import { Button } from "../Button/Button";
import { BaseFieldProps, createBaseFieldProps } from "../Field/createBaseFieldProps";
import {
	createFieldErrorMessageProps,
	FieldWithErrorMessageSupport,
} from "../Field/FieldError/createFieldErrorMessageProps";
import { tuiFormatNumber } from "./formatNumber";
import * as styles from "./NumberField.css";
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

		if (event.key === "ArrowDown") {
			decrement();
		} else {
			increment();
		}

		internalRef.value = formattedValue();
	};

	const increment = () => {
		setValue(clamp((value() || 0) + optionsWithDefault.step, computeMin(), computeMax()));
	};

	const decrement = () => {
		setValue(clamp((value() || 0) - optionsWithDefault.step, computeMin(), computeMax()));
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
		internalRef.value = formattedValue();
	};

	const formattedValue = (): string => {
		return value() !== null ? getFormattedValue(value() || 0) : "";
	};

	const getFormattedValue = (value: number): string => {
		let decimalLimit = optionsWithDefault.precision;
		return (
			optionsWithDefault.prefix +
			tuiFormatNumber(value, {
				...defaultNumberFormat,
				decimalLimit,
			}).replace(CHAR_HYPHEN, CHAR_MINUS) +
			optionsWithDefault.postfix
		);
	};

	const onFocused = (focused: boolean) => {
		const nativeNumberValue = value()
			? maskitoParseNumber(String(value() ?? ""), defaultNumberFormat.decimalSeparator)
			: value();

		if (Number.isNaN(nativeNumberValue)) {
			internalRef.value = focused
				? optionsWithDefault.prefix + optionsWithDefault.postfix
				: "";
			setValue(undefined);
			return;
		}

		if (!focused) {
			setValue(nativeNumberValue);
			internalRef.value = formattedValue();
		}
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

				<div class={styles.controlsContainer}>
					<Button
						type={"button"}
						variant={"ghost"}
						theme={"secondary"}
						aria-label={`Increment by ${optionsWithDefault.step}`}
						class={styles.controlButton}
						onClick={increment}
					>
						<ChevronUpIcon class={styles.control} />
					</Button>
					<Button
						type={"button"}
						variant={"ghost"}
						theme={"secondary"}
						aria-label={`Decrement by ${optionsWithDefault.step}`}
						class={styles.controlButton}
						onClick={decrement}
					>
						<ChevronDownIcon class={styles.control} />
					</Button>
				</div>
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
