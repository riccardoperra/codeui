import { access, MaybeAccessor } from "@solid-primitives/utils";
import {
	Maskito,
	MASKITO_DEFAULT_ELEMENT_PREDICATE,
	MASKITO_DEFAULT_OPTIONS,
	MaskitoElementPredicate,
	MaskitoOptions,
} from "@maskito/core";
import { createEffect, createSignal, Setter } from "solid-js";

export const createMaskito = ({
	options = MASKITO_DEFAULT_OPTIONS,
	elementPredicate = MASKITO_DEFAULT_ELEMENT_PREDICATE,
}: {
	options?: MaybeAccessor<MaskitoOptions>;
	elementPredicate?: MaybeAccessor<MaskitoElementPredicate>;
} = {}): Setter<HTMLElement | null> => {
	const [ref, setRef] = createSignal<HTMLElement | null>(null);

	createEffect(
		() => ({
			refValue: ref(),
			maskitoOptions: access(options),
			elementPredicateValue: access(elementPredicate),
		}),
		({ refValue, maskitoOptions, elementPredicateValue }) => {
			if (!refValue) {
				return;
			}
			let disposed = false;
			let maskedElement: Maskito | undefined;
			const element = elementPredicateValue(refValue);
			if (element instanceof Promise) {
				void element.then(value => {
					if (!disposed) maskedElement = new Maskito(value, maskitoOptions);
				});
			} else {
				maskedElement = new Maskito(element, maskitoOptions);
			}
			return () => {
				disposed = true;
				maskedElement?.destroy();
			};
		},
	);

	return setRef;
};
