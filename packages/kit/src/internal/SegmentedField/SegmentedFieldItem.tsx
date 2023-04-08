/*!
 * Portions of this file are based on code from react-spectrum.
 * Apache License Version 2.0, Copyright 2020 Adobe.
 *
 * Credits to the React Spectrum team:
 * https://github.com/adobe/react-spectrum/blob/70e7caf1946c423bc9aa9cb0e50dbdbe953d239b/packages/@react-aria/radio/src/useRadio.ts
 */

import {
	callHandler,
	createGenerateId,
	mergeDefaultProps,
	OverrideProps,
} from "@kobalte/utils";
import {
	Accessor,
	ComponentProps,
	createMemo,
	createSignal,
	createUniqueId,
	JSX,
	splitProps,
} from "solid-js";
import { AsChildProp, useFormControlContext } from "@kobalte/core";
import {
	SegmentedFieldItemContext,
	SegmentedFieldItemContextValue,
	SegmentedFieldItemDataSet,
} from "./SegmentedFieldItemContext";
import { useSegmentedFieldContext } from "./SegmentedFieldContext";

export interface SegmentedFieldItemOptions extends AsChildProp {
	/**
	 * The value of the radio button, used when submitting an HTML form.
	 * See [MDN](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/radio#Value).
	 */
	value: string;

	/** Whether the radio button is disabled or not. */
	isDisabled?: boolean;
}

/**
 * The root container for a radio button.
 */
export function SegmentedFieldItem(
	props: OverrideProps<ComponentProps<"label">, SegmentedFieldItemOptions>,
) {
	const formControlContext = useFormControlContext();
	const segmentedFieldContext = useSegmentedFieldContext();

	const defaultId = `${formControlContext.generateId("item")}-${createUniqueId()}`;

	props = mergeDefaultProps({ id: defaultId }, props);

	const [local, others] = splitProps(props, ["value", "isDisabled", "onPointerDown"]);

	const [isFocused, setIsFocused] = createSignal(false);

	const isSelected = createMemo(() => {
		return segmentedFieldContext.isSelectedValue(local.value);
	});

	const isDisabled = createMemo(() => {
		return local.isDisabled || formControlContext.isDisabled() || false;
	});

	const onPointerDown: JSX.EventHandlerUnion<any, PointerEvent> = e => {
		callHandler(e, local.onPointerDown);

		// For consistency with native, prevent the input blurs on pointer down.
		if (isFocused()) {
			e.preventDefault();
		}
	};

	const dataset: Accessor<SegmentedFieldItemDataSet> = createMemo(() => ({
		"data-valid": formControlContext.dataset()["data-valid"],
		"data-invalid": formControlContext.dataset()["data-invalid"],
		"data-checked": isSelected() ? "" : undefined,
		"data-disabled": isDisabled() ? "" : undefined,
	}));

	const context: SegmentedFieldItemContextValue = {
		value: () => local.value,
		dataset,
		isSelected,
		isDisabled,
		generateId: createGenerateId(() => others.id!),
		setIsFocused,
	};

	return (
		<SegmentedFieldItemContext.Provider value={context}>
			<label onPointerDown={onPointerDown} {...dataset()} {...others} />
		</SegmentedFieldItemContext.Provider>
	);
}
