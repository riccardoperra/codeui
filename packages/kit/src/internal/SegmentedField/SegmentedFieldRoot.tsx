import {
	createControllableSignal,
	createFormControl,
	createFormResetListener,
	FORM_CONTROL_PROP_NAMES,
	FormControlContext,
} from "@kobalte/core";
import {
	access,
	createPolymorphicComponent,
	mergeDefaultProps,
	mergeRefs,
	Orientation,
	ValidationState,
} from "@kobalte/utils";
import { createUniqueId, splitProps } from "solid-js";
import { Dynamic } from "solid-js/web";
import {
	SegmentedFieldContext,
	SegmentedFieldContextValue,
} from "./SegmentedFieldContext";

export interface SegmentedFieldRootOptions {
	/** The controlled value of the radio button to check. */
	value?: string;

	/**
	 * The value of the radio button that should be checked when initially rendered.
	 * Useful when you do not need to control the state of the radio buttons.
	 */
	defaultValue?: string;

	/** Event handler called when the value changes. */
	onValueChange?: (value: string) => void;

	/** Event handler called when the index of the active element changes. */
	onActiveIndexChange?: (index: number) => void;

	/** The axis the radio group items should align with. */
	orientation?: Orientation;

	/**
	 * A unique identifier for the component.
	 * The id is used to generate id attributes for nested components.
	 * If no id prop is provided, a generated id will be used.
	 */
	id?: string;

	/**
	 * The name of the radio group.
	 * Submitted with its owning form as part of a name/value pair.
	 */
	name?: string;

	/** Whether the radio group should display its "valid" or "invalid" visual styling. */
	validationState?: ValidationState;

	/** Whether the user must select an item before the owning form can be submitted. */
	isRequired?: boolean;

	/** Whether the radio group is disabled. */
	isDisabled?: boolean;

	/** Whether the radio group is read only. */
	isReadOnly?: boolean;
}

/**
 * A set of checkable buttons, known as radio buttons, where no more than one of the buttons can be checked at a time.
 * This component is based on the [WAI-ARIA Radio Group Pattern](https://www.w3.org/WAI/ARIA/apg/patterns/radiobutton/)
 */
export const SegmentedFieldRoot = createPolymorphicComponent<
	"div",
	SegmentedFieldRootOptions
>(props => {
	let ref: HTMLDivElement | undefined;

	const defaultId = `segmentedField-${createUniqueId()}`;

	props = mergeDefaultProps(
		{
			as: "div",
			id: defaultId,
			orientation: "vertical",
		},
		props,
	);

	const [local, formControlProps, others] = splitProps(
		props,
		[
			"as",
			"ref",
			"value",
			"defaultValue",
			"onValueChange",
			"onActiveIndexChange",
			"orientation",
			"aria-labelledby",
			"aria-describedby",
		],
		FORM_CONTROL_PROP_NAMES,
	);

	const [selected, setSelected] = createControllableSignal<string>({
		value: () => local.value,
		defaultValue: () => local.defaultValue,
		onChange: value => local.onValueChange?.(value),
	});

	const { formControlContext } = createFormControl(formControlProps);

	createFormResetListener(
		() => ref,
		() => setSelected(local.defaultValue ?? ""),
	);

	const ariaLabelledBy = () => {
		return formControlContext.getAriaLabelledBy(
			access(formControlProps.id),
			others["aria-label"],
			local["aria-labelledby"],
		);
	};

	const ariaDescribedBy = () => {
		return formControlContext.getAriaDescribedBy(local["aria-describedby"]);
	};

	const isSelectedValue = (value: string) => {
		return value === selected();
	};

	const context: SegmentedFieldContextValue = {
		ariaDescribedBy,
		isSelectedValue,
		setSelectedValue: value => {
			if (formControlContext.isReadOnly() || formControlContext.isDisabled()) {
				return;
			}

			setSelected(value);

			// Sync all radio input checked state in the group with the selected value.
			// This is necessary because checked state might be out of sync
			// (ex: when using controlled radio-group).
			ref?.querySelectorAll("[type='radio']").forEach(el => {
				const radio = el as HTMLInputElement;
				radio.checked = isSelectedValue(radio.value);
			});
		},
	};

	return (
		<FormControlContext.Provider value={formControlContext}>
			<SegmentedFieldContext.Provider value={context}>
				<Dynamic
					component={local.as}
					ref={mergeRefs(el => (ref = el), local.ref)}
					id={access(formControlProps.id)}
					role="radiogroup"
					aria-invalid={formControlContext.validationState() === "invalid" || undefined}
					aria-required={formControlContext.isRequired() || undefined}
					aria-disabled={formControlContext.isDisabled() || undefined}
					aria-readonly={formControlContext.isReadOnly() || undefined}
					aria-orientation={local.orientation}
					aria-labelledby={ariaLabelledBy()}
					aria-describedby={ariaDescribedBy()}
					{...formControlContext.dataset()}
					{...others}
				/>
			</SegmentedFieldContext.Provider>
		</FormControlContext.Provider>
	);
});
