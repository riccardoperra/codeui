import { isNumber } from "@kobalte/utils";
import { defaultNumberFormat, NumberFormatSettings } from "./options";
import { tuiCeil, tuiFloor, tuiRound, tuiTrunc } from "./round";
import { CHAR_HYPHEN } from "./unicodeCharacters";

export type TuiRounding = "ceil" | "floor" | "round" | "truncate";

export function tuiRoundWith({
	value,
	precision,
	method,
}: {
	value: number;
	precision: number;
	method: TuiRounding;
}): number {
	switch (method) {
		case `round`:
			return tuiRound(value, precision);
		case `ceil`:
			return tuiCeil(value, precision);
		case `floor`:
			return tuiFloor(value, precision);
		default:
			return tuiTrunc(value, precision);
	}
}

export function tuiFormatNumber(
	value: number,
	settings: Partial<NumberFormatSettings> = {},
): string {
	const { decimalLimit, decimalSeparator, thousandSeparator, zeroPadding, rounding } = {
		...defaultNumberFormat,
		...settings,
	};

	const rounded = Number.isFinite(decimalLimit)
		? tuiRoundWith({ value, precision: decimalLimit, method: rounding })
		: value;
	const integerPartString = String(Math.floor(Math.abs(rounded)));

	let fractionPartPadded = tuiGetFractionPartPadded(rounded, decimalLimit);

	if (Number.isFinite(decimalLimit)) {
		if (zeroPadding) {
			const zeroPaddingSize: number = Math.max(
				decimalLimit - fractionPartPadded.length,
				0,
			);
			const zeroPartString = `0`.repeat(zeroPaddingSize);

			fractionPartPadded = `${fractionPartPadded}${zeroPartString}`;
		} else {
			fractionPartPadded = fractionPartPadded.replace(/0*$/, ``);
		}
	}

	const remainder = integerPartString.length % 3;
	const sign = value < 0 ? CHAR_HYPHEN : ``;
	let result = sign + integerPartString.charAt(0);

	for (let i = 1; i < integerPartString.length; i++) {
		if (i % 3 === remainder && integerPartString.length > 3) {
			result += thousandSeparator;
		}

		result += integerPartString.charAt(i);
	}

	return fractionPartPadded ? result + decimalSeparator + fractionPartPadded : result;
}

export function tuiNumberToStringWithoutExp(value: number): string {
	const valueAsString = String(value);
	const [numberPart, expPart] = valueAsString.split(`e-`);

	let valueWithoutExp = valueAsString;

	if (expPart) {
		const [, fractionalPart] = numberPart.split(`.`);
		const decimalDigits = Number(expPart) + (fractionalPart?.length || 0);

		valueWithoutExp = value.toFixed(decimalDigits);
	}

	return valueWithoutExp;
}

export function tuiGetFractionPartPadded(
	value: number,
	precision?: number | null,
): string {
	const [, fractionPartPadded = ``] = tuiNumberToStringWithoutExp(value).split(`.`);

	return isNumber(precision)
		? fractionPartPadded.slice(0, Math.max(0, precision))
		: fractionPartPadded;
}
