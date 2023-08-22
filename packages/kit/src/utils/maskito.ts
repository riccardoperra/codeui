import { access, MaybeAccessor } from "@kobalte/utils";
import {
	Maskito,
	MASKITO_DEFAULT_ELEMENT_PREDICATE,
	MASKITO_DEFAULT_OPTIONS,
	MaskitoElementPredicate,
	MaskitoOptions,
} from "@maskito/core";
import { createEffect, createSignal, onCleanup, Setter } from "solid-js";

/**
 * Hook for convenient use of Maskito in React
 * @description For controlled inputs use `onInput` event
 * @param options options used for creating Maskito
 * @param elementPredicate function that can help find nested Input or TextArea
 * @returns ref callback to pass it in React Element
 * @example
 * // To avoid unnecessary hook runs with Maskito recreation pass named variables
 * // good example ✅
 * useMaskito({ options: maskitoOptions, elementPredicate: maskitoPredicate })
 *
 * // bad example ❌
 * useMaskito({ options: { mask: /^.*$/ }, elementPredicate: () => e.querySelector('input') })
 */
export const createMaskito = ({
	options = MASKITO_DEFAULT_OPTIONS,
	elementPredicate = MASKITO_DEFAULT_ELEMENT_PREDICATE,
}: {
	options?: MaybeAccessor<MaskitoOptions>;
	elementPredicate?: MaybeAccessor<MaskitoElementPredicate>;
} = {}): Setter<HTMLElement> => {
	const [ref, setRef] = createSignal<HTMLElement | null>(null);

	createEffect(() => {
		const refValue = ref();
		const maskitoOptions = access(options);
		const elementPredicateValue = access(elementPredicate);
		if (!refValue) {
			return;
		}
		const maskedElement = new Maskito(elementPredicateValue(refValue), maskitoOptions);
		onCleanup(() => maskedElement.destroy());
	});

	return setRef;
};
