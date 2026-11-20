import { pickProps } from "../utils/pick-props";
import "@codeui/styles/theme.css";
import "@codeui/styles/numberfield.css";
import { createControllableSignal } from "@solid-primitives/controlled-signal";
import { callHandler, clamp } from "@kobalte/utils";
import {
	maskitoCaretGuard,
	maskitoNumberOptionsGenerator,
	maskitoParseNumber,
} from "@maskito/kit";
import {
	createContext,
	createSignal,
	onCleanup,
	untrack,
	useContext,
	omit,
} from "solid-js";
import { type JSX } from "@solidjs/web";
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

	const initialValue = untrack(() => state.value ?? state.defaultValue ?? "");
	const [unfinishedValue, setUnfinishedValue] = createSignal<string | null>(
		String(initialValue),
	);

	let internalRef: HTMLInputElement | undefined;

	const optionsWithDefault: InputNumberOptions = {
		get min() {
			return options.min ?? defaultOptions.min;
		},
		get max() {
			return options.max ?? defaultOptions.max;
		},
		get step() {
			return options.step ?? defaultOptions.step;
		},
		get precision() {
			return options.precision ?? defaultOptions.precision;
		},
		get prefix() {
			return options.prefix ?? defaultOptions.prefix;
		},
		get postfix() {
			return options.postfix ?? defaultOptions.postfix;
		},
	};
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
		mask(element);
	}

	function detachInput(element: HTMLInputElement) {
		if (internalRef !== element) return;
		internalRef = undefined;
		mask(null);
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
		setNativeValue(formatValue(newValue));
		setUnfinishedValue(String(newValue));
	};

	const onValueChange = (nativeValue: string) => {
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
	};

	const formattedValue = () => formatValue(value());

	const formatValue = (value: number | null | undefined): string => {
		if (value === null) return "";
		const currentValue = value || 0;
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
	};

	return {
		attachInput,
		detachInput,
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
	const options = pickProps(
		props,
		"min",
		"max",
		"step",
		"precision",
		"prefix",
		"postfix",
	);
	const state = pickProps(props, "value", "onChange", "defaultValue");
	const others = omit(
		props,
		"min",
		"max",
		"step",
		"precision",
		"prefix",
		"postfix",
		"value",
		"onChange",
		"defaultValue",
	);
	const control = createNumberFieldState(props, options, state);
	return (
		<NumberFieldContext value={control}>
			<FieldRoot
				{...others}
				marker="numberfield"
				baseClass={styles.baseFieldContainer}
				size={others.size ?? "sm"}
				value={control.displayValue()}
				onChange={control.onValueChange}
			/>
		</NumberFieldContext>
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
	const others = omit(props, "ref", "onKeyDown", "onBlur", "onFocus");
	let input: HTMLInputElement | undefined;
	onCleanup(() => {
		if (input) control.detachInput(input);
	});
	return (
		<FieldInput
			{...others}
			baseClass={styles.textField}
			ref={[
				props.ref,
				(element: HTMLInputElement) => {
					input = element;
					control.attachInput(element);
				},
			]}
			type="text"
			role="spinbutton"
			aria-valuenow={control.value() ?? undefined}
			aria-valuetext={control.value() == null ? undefined : control.formattedValue()}
			aria-valuemin={control.options.min}
			aria-valuemax={control.options.max}
			onKeyDown={event => {
				callHandler(event, props.onKeyDown);
				if (!event.defaultPrevented) control.onKeyDown(event);
			}}
			onBlur={event => {
				callFocusHandler(event, props.onBlur);
				control.onFocused(false);
			}}
			onFocus={event => {
				callFocusHandler(event, props.onFocus);
				control.onFocused(true);
			}}
		/>
	);
}

export type FieldProps = JSX.HTMLAttributes<HTMLDivElement>;
export function Field(props: FieldProps) {
	const others = omit(props, "class");
	return (
		<div {...others} class={mergeClasses(styles.numberFieldContainer, props.class)} />
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
