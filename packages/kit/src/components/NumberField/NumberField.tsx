import { pickProps } from "../../utils/pick-props";
import type { TextFieldRootOptions as KTextFieldRootOptions } from "@kobalte/core/text-field";
import { Show, type Ref, omit } from "solid-js";
import { type JSX } from "@solidjs/web";
import * as P from "../../parts/number-field";
import type { SlotProp } from "../../utils/component";
import { mergeClasses } from "../../utils/css";
import type { FieldWithErrorMessageSupport } from "../Field/FieldError/createFieldErrorMessageProps";
import type { BaseFieldProps } from "../Field/createBaseFieldProps";
import { INPUT_KEYS, type FieldInputProps, type FieldClasses } from "../Field/inputProps";
import type { InputNumberOptions } from "./options";

type TextFieldSlot = "root" | "input" | "label" | "errorLabel";

type NumberFieldRootOptions = Omit<
	KTextFieldRootOptions,
	"value" | "defaultValue" | "onChange"
> & {
	value?: number | null;
	defaultValue?: number;
	onChange?: (value: number | undefined | null) => void;
};

export type NumberFieldProps = NumberFieldRootOptions &
	BaseFieldProps &
	FieldWithErrorMessageSupport & {
		description?: JSX.Element;
		classes?: FieldClasses;
		/** @deprecated Use classes. This alias remains until 1.0. */
		slotClasses?: SlotProp<TextFieldSlot>["slotClasses"];
		label?: JSX.Element;
		placeholder?: string;
		ref?: Ref<HTMLInputElement>;
	} & FieldInputProps &
	SlotProp<TextFieldSlot> &
	Partial<InputNumberOptions>;

export function NumberField(props: NumberFieldProps) {
	const others = omit(
		props,
		"description",
		"label",
		"errorMessage",
		"placeholder",
		"ref",
		"slotClasses",
		"classes",
	);

	const inputProps = pickProps(others, ...INPUT_KEYS);
	const rootProps = omit(others, ...INPUT_KEYS);

	return (
		<P.Root
			class={mergeClasses(props.slotClasses?.root, props.classes?.root)}
			{...rootProps}
		>
			<Show when={props.label} keyed={false}>
				{label => (
					<P.Label class={mergeClasses(props.slotClasses?.label, props.classes?.label)}>
						{label()}
					</P.Label>
				)}
			</Show>

			<P.Field>
				<P.Input
					{...inputProps}
					class={mergeClasses(props.slotClasses?.input, props.classes?.input)}
					placeholder={props.placeholder}
					ref={props.ref}
				/>
				<P.Controls />
			</P.Field>

			<Show when={props.description} keyed={false}>
				{description => (
					<P.Description class={props.classes?.description}>
						{description()}
					</P.Description>
				)}
			</Show>
			<Show
				when={props.validationState === "invalid" && props.errorMessage}
				keyed={false}
			>
				{errorMessage => (
					<P.ErrorMessage
						class={mergeClasses(
							props.slotClasses?.errorLabel,
							props.classes?.errorMessage,
						)}
					>
						{errorMessage()}
					</P.ErrorMessage>
				)}
			</Show>
		</P.Root>
	);
}

export { NumberFieldLabel } from "./NumberFieldLabel";
