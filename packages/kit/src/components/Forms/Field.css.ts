import { StyleRule } from "@vanilla-extract/css";
import { BaseComponentSize, mapFontSizeValue } from "../../foundation/sizes.css";

function makeFieldMessageSize(
	sizesMap: Record<BaseComponentSize, BaseComponentSize>,
	size: BaseComponentSize,
): StyleRule["selectors"] {
	return {
		[`[data-field-size=${size}] &`]: {
			fontSize: mapFontSizeValue(sizesMap[size]),
		},
	};
}

export function styleFieldMessage(
	sizesMap: Record<BaseComponentSize, BaseComponentSize>,
) {
	return {
		selectors: {
			...makeFieldMessageSize(sizesMap, "xs"),
			...makeFieldMessageSize(sizesMap, "sm"),
			...makeFieldMessageSize(sizesMap, "md"),
			...makeFieldMessageSize(sizesMap, "lg"),
			...makeFieldMessageSize(sizesMap, "xl"),
		},
	};
}
