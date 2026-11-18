import "@codeui/styles/theme.css";
import "@codeui/styles/number-field.css";
import { createControllableSignal } from "@kobalte/core/primitives/create-controllable-signal";
import { callHandler, clamp, mergeRefs } from "@kobalte/utils";
import {
	maskitoCaretGuard,
	maskitoNumberOptionsGenerator,
	maskitoParseNumber,
} from "@maskito/kit";
import {
	batch,
	createContext,
	createSignal,
	mergeProps,
	onCleanup,
	onMount,
	splitProps,
	useContext,
	type JSX,
} from "solid-js";
import { NumberFieldControls } from "../components/NumberField/NumberFieldControls";
import { formatNumber } from "../components/NumberField/formatNumber";
import {
	defaultNumberFormat,
	INPUT_NUMBER_OPTIONS as defaultOptions,
	type InputNumberOptions,
} from "../components/NumberField/options";
import * as styles from "../components/NumberField/NumberField.css";
import { CHAR_HYPHEN, CHAR_MINUS } from "../components/NumberField/unicodeCharacters";
import {
	FieldInput,
	FieldRoot,
	type FieldInputProps,
	type FieldRootProps,
} from "../components/TextField/field-parts";
import { mergeClasses } from "../utils/css";
import { createMaskito } from "../utils/maskito";

export {
	Description,
	ErrorMessage,
	Label,
	type DescriptionProps,
	type ErrorMessageProps,
	type LabelProps,
} from "../components/TextField/field-parts";

export type RootProps = Omit<FieldRootProps, "value" | "defaultValue" | "onChange"> &
	Partial<InputNumberOptions> & {
		value?: number | null;
		defaultValue?: number;
		onChange?: (value: number | undefined | null) => void;
	};

type NumericProps = Pick<RootProps, "value" | "defaultValue" | "onChange">;

const NumberFieldContext = createContext<ReturnType<typeof createNumberFieldState>>();

function useNumberFieldParts() {
	const context = useContext(NumberFieldContext);
	if (!context) throw new Error("Number field parts must be rendered inside their Root.");
	return context;
}

function createNumberFieldState(
	props: RootProps,
	options: Partial<InputNumberOptions>,
	state: NumericProps,
) {
	const [focused, setFocused] = createSignal(false);
	const [value, setValue] = createControllableSignal<number | undefined | null>({
		value: () => state.value,
		defaultValue: () => state.defaultValue,
		onChange: value => {
			state.onChange?.(value);
		},
	});

	const initialValue = state.value ?? state.defaultValue ?? "";
	const [unfinishedValue, setUnfinishedValue] = createSignal<string | null>(
		String(initialValue),
	);

	let internalRef: HTMLInputElement | undefined;

	const optionsWithDefault = mergeProps(defaultOptions, options);
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
				decimalZeroPadding: true,
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

	function attachInput(element: HTMLInputElement) {
		internalRef = element;
		onMount(() => mask(element));
		onCleanup(() => {
			if (internalRef === element) {
				internalRef = undefined;
				mask(null);
			}
		});
	}

	const displayValue = () => {
		const isFocused = focused();
		const dirtyValue = unfinishedValue();
		const sanitizedValue = value();
		const newValue = isFocused ? dirtyValue : sanitizedValue;
		return newValue == null || newValue === "" ? undefined : String(newValue);
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

	const setNativeValue = (value: string) => {
		if (internalRef) internalRef.value = value;
	};

	const isLocked = () => !!(props.disabled || props.readOnly);
	const canIncrement = () => !isLocked() && (value() ?? 0) < computeMax();
	const canDecrement = () => !isLocked() && (value() ?? 0) > computeMin();

	const onKeyDown = (event: KeyboardEvent) => {
		if (!(event.key === "ArrowDown" || event.key === "ArrowUp")) {
			return;
		}
		event.preventDefault();
		if (isLocked()) {
			return;
		}
		if (event.key === "ArrowDown") {
			decrement();
		} else {
			increment();
		}
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
		setUnfinishedValue(String(newValue));
	};

	const onValueChange = (nativeValue: string) => {
		batch(() => {
			const parsedValue = maskitoParseNumber(
				nativeValue,
				defaultNumberFormat.decimalSeparator,
			);

			setUnfinishedValue(null);

			if (Number.isNaN(parsedValue)) {
				setUnfinishedValue("");
				setValue(null);
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
		});
	};

	const formattedValue = (): string => {
		if (value() === null) {
			return "";
		}
		const currentValue = value() || 0;
		const hasFraction = Math.abs(currentValue) % 1 > 0;
		const decimalLimit = hasFraction ? optionsWithDefault.precision : 0;

		return (
			optionsWithDefault.prefix +
			formatNumber(currentValue, {
				...defaultNumberFormat,
				decimalLimit,
			}).replace(CHAR_HYPHEN, CHAR_MINUS) +
			optionsWithDefault.postfix
		);
	};

	const onFocused = (focused: boolean) => {
		setFocused(focused);

		batch(() => {
			const pendingValue = unfinishedValue();
			const nativeNumber = pendingValue
				? maskitoParseNumber(pendingValue, defaultNumberFormat.decimalSeparator)
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
		});
	};

	return {
		attachInput,
		canDecrement,
		canIncrement,
		decrement,
		displayValue,
		formattedValue,
		increment,
		onFocused,
		onKeyDown,
		onValueChange,
		optionsWithDefault,
		options,
		value,
	};
}

export function Root(props: RootProps) {
	const [options, state, others] = splitProps(
		props,
		["min", "max", "step", "precision", "prefix", "postfix"],
		["value", "onChange", "defaultValue"],
	);
	const control = createNumberFieldState(props, options, state);
	return (
		<NumberFieldContext.Provider value={control}>
			<FieldRoot
				{...others}
				marker="number-field"
				baseClass={styles.baseFieldContainer}
				size={others.size ?? "md"}
				value={control.displayValue()}
				onChange={control.onValueChange}
			/>
		</NumberFieldContext.Provider>
	);
}

export type InputProps = Omit<
	FieldInputProps,
	"type" | "role" | "aria-valuenow" | "aria-valuetext" | "aria-valuemin" | "aria-valuemax"
>;
function callFocusHandler(
	event: Parameters<JSX.FocusEventHandler<HTMLInputElement, FocusEvent>>[0],
	handler: JSX.FocusEventHandlerUnion<HTMLInputElement, FocusEvent> | undefined,
) {
	if (typeof handler === "function") handler(event);
	else if (handler) handler[0](handler[1], event);
}

export function Input(props: InputProps) {
	const control = useNumberFieldParts();
	const [local, others] = splitProps(props, ["ref", "onKeyDown", "onBlur", "onFocus"]);
	return (
		<FieldInput
			{...others}
			baseClass={styles.textField}
			ref={mergeRefs(local.ref, control.attachInput)}
			type="text"
			role="spinbutton"
			aria-valuenow={control.value() ?? undefined}
			aria-valuetext={control.value() == null ? undefined : control.formattedValue()}
			aria-valuemin={control.options.min}
			aria-valuemax={control.options.max}
			onKeyDown={event => {
				callHandler(event, local.onKeyDown);
				if (!event.defaultPrevented) control.onKeyDown(event);
			}}
			onBlur={event => {
				callFocusHandler(event, local.onBlur);
				control.onFocused(false);
			}}
			onFocus={event => {
				callFocusHandler(event, local.onFocus);
				control.onFocused(true);
			}}
		/>
	);
}

export type FieldProps = JSX.HTMLAttributes<HTMLDivElement>;
export function Field(props: FieldProps) {
	const [local, others] = splitProps(props, ["class"]);
	return (
		<div {...others} class={mergeClasses(styles.numberFieldContainer, local.class)} />
	);
}

export type ControlsProps = { class?: string };
export function Controls(props: ControlsProps) {
	const control = useNumberFieldParts();
	return (
		<NumberFieldControls
			class={props.class}
			canIncrement={control.canIncrement()}
			canDecrement={control.canDecrement()}
			increment={control.increment}
			decrement={control.decrement}
			step={control.optionsWithDefault.step}
		/>
	);
}
