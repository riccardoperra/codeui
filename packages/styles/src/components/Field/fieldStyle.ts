import {
	BaseComponentSize,
	mapFontSizeValue,
	mapLineHeightValue,
} from "../../foundation/sizes";
import { StyleRule } from "../../types";

function makeFieldMessageSize(
	sizesMap: Record<BaseComponentSize, Parameters<typeof mapFontSizeValue>[0]>,
	size: BaseComponentSize,
): StyleRule["selectors"] {
	return {
		[`[data-field-size=${size}] &`]: {
			fontSize: mapFontSizeValue(sizesMap[size]),
			lineHeight: mapLineHeightValue(sizesMap[size]),
		},
	};
}

export function styleFieldMessage(
	sizesMap: Record<BaseComponentSize, Parameters<typeof mapFontSizeValue>[0]>,
): { selectors: StyleRule["selectors"] } {
	return {
		selectors: {
			...makeFieldMessageSize(sizesMap, "xs"),
			...makeFieldMessageSize(sizesMap, "sm"),
			...makeFieldMessageSize(sizesMap, "md"),
			...makeFieldMessageSize(sizesMap, "lg"),
		},
	};
}
