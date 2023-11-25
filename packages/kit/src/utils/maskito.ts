import { access, MaybeAccessor } from "@kobalte/utils";
import {
	Maskito,
	MASKITO_DEFAULT_ELEMENT_PREDICATE,
	MASKITO_DEFAULT_OPTIONS,
	MaskitoElementPredicate,
	MaskitoOptions,
} from "@maskito/core";
import { createEffect, createSignal, onCleanup, Setter } from "solid-js";

export const createMaskito = ({
	options = MASKITO_DEFAULT_OPTIONS,
	elementPredicate = MASKITO_DEFAULT_ELEMENT_PREDICATE,
}: {
	options?: MaybeAccessor<MaskitoOptions>;
	elementPredicate?: MaybeAccessor<MaskitoElementPredicate>;
} = {}): Setter<HTMLElement | null> => {
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
