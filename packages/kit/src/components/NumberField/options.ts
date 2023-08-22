import { InputNumberOptions } from "./NumberField";

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

export const INPUT_NUMBER_OPTIONS: InputNumberOptions = {
	min: Number.MIN_SAFE_INTEGER,
	max: Number.MAX_SAFE_INTEGER,
	step: 1,
	precision: 2,
	prefix: "",
	postfix: "",
};

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
