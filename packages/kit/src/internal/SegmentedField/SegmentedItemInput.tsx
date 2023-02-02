/*!
 * Portions of this file are based on code from react-spectrum.
 * Apache License Version 2.0, Copyright 2020 Adobe.
 *
 * Credits to the React Spectrum team:
 * https://github.com/adobe/react-spectrum/blob/70e7caf1946c423bc9aa9cb0e50dbdbe953d239b/packages/@react-aria/radio/src/useRadio.ts
 */

import {
	callHandler,
	mergeDefaultProps,
	OverrideProps,
	visuallyHiddenStyles,
} from "@kobalte/utils";
import { ComponentProps, JSX, splitProps } from "solid-js";
import { useFormControlContext } from "@kobalte/core";
import { useSegmentedFieldContext } from "./SegmentedFieldContext";
import { useSegmentedFieldItemContext } from "./SegmentedFieldItemContext";

export interface SegmentedItemInputOptions {
	/** The HTML styles attribute (object form only). */
	style?: JSX.CSSProperties;
}

/**
 * The native html input that is visually hidden in the radio button.
 */
export function SegmentedItemInput(
	props: OverrideProps<ComponentProps<"input">, SegmentedItemInputOptions>,
) {
	const formControlContext = useFormControlContext();
	const segmentedFieldContext = useSegmentedFieldContext();
	const segmentContext = useSegmentedFieldItemContext();

	props = mergeDefaultProps(
		{
			id: segmentContext.generateId("input"),
		},
		props,
	);

	const [local, others] = splitProps(props, [
		"style",
		"aria-labelledby",
		"aria-describedby",
		"onChange",
		"onFocus",
		"onBlur",
	]);

	const ariaLabelledBy = () => {
		return (
			[
				local["aria-labelledby"],
				// If there is both an aria-label and aria-labelledby, add the input itself has an aria-labelledby
				local["aria-labelledby"] != null && others["aria-label"] != null
					? others.id
					: undefined,
			]
				.filter(Boolean)
				.join(" ") || undefined
		);
	};

	const ariaDescribedBy = () => {
		return (
			[local["aria-describedby"], segmentedFieldContext.ariaDescribedBy()]
				.filter(Boolean)
				.join(" ") || undefined
		);
	};

	const onChange: JSX.EventHandlerUnion<HTMLInputElement, Event> = e => {
		callHandler(e, local.onChange);

		e.stopPropagation();

		segmentedFieldContext.setSelectedValue(segmentContext.value());

		const target = e.target as HTMLInputElement;

		// Unlike in React, inputs `checked` state can be out of sync with our state.
		// for example a readonly `<input type="radio" />` is always "checkable".
		//
		// Also, even if an input is controlled (ex: `<input type="radio" checked={isChecked} />`,
		// clicking on the input will change its internal `checked` state.
		//
		// To prevent this, we need to force the input `checked` state to be in sync with our state.
		target.checked = segmentContext.isSelected();
	};

	const onFocus: JSX.EventHandlerUnion<any, FocusEvent> = e => {
		callHandler(e, local.onFocus);
		segmentContext.setIsFocused(true);
	};

	const onBlur: JSX.EventHandlerUnion<any, FocusEvent> = e => {
		callHandler(e, local.onBlur);
		segmentContext.setIsFocused(false);
	};

	return (
		<input
			type="radio"
			name={formControlContext.name()}
			value={segmentContext.value()}
			checked={segmentContext.isSelected()}
			required={formControlContext.isRequired()}
			disabled={segmentContext.isDisabled()}
			readonly={formControlContext.isReadOnly()}
			style={{ ...visuallyHiddenStyles, ...local.style }}
			aria-labelledby={ariaLabelledBy()}
			aria-describedby={ariaDescribedBy()}
			onChange={onChange}
			onFocus={onFocus}
			onBlur={onBlur}
			{...segmentContext.dataset()}
			{...others}
		/>
	);
}
