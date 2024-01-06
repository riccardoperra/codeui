/*
 *
 * Portions of this file are based on code from Taiga UI.
 * Copyright 2020 Tinkoff Bank
 *
 * This file is licensed to you under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License. You may obtain a copy
 * of the License at http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under
 * the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
 * OF ANY KIND, either express or implied. See the License for the specific language
 * governing permissions and limitations under the License.
 */
const MAX_PRECISION = 292;

export function round(value: number, precision: number = 0): number {
	return calculate(value, precision, Math.round);
}

export function ceil(value: number, precision: number = 0): number {
	return calculate(value, precision, Math.ceil);
}

export function floor(value: number, precision: number = 0): number {
	return calculate(value, precision, Math.floor);
}

export function trunc(value: number, precision: number = 0): number {
	return calculate(value, precision, Math.trunc);
}

/**
 * Rounding number to the set precision
 *
 * @param value
 * @param precision number of digits in a float part
 * @param func rounding function (round, floor, ceil)
 */
function calculate(
	value: number,
	precision: number,
	func: (x: number) => number,
): number {
	if (value === Infinity) {
		return value;
	}

	precision = Math.min(precision, MAX_PRECISION);

	const pair = `${value}e`.split(`e`);
	const tempValue = func(Number(`${pair[0]}e${Number(pair[1]) + precision}`));
	const processedPair = `${tempValue}e`.split(`e`);

	return Number(`${processedPair[0]}e${Number(processedPair[1]) - precision}`);
}
