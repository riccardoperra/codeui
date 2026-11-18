import type { TextFieldRootOptions as KTextFieldRootOptions } from "@kobalte/core/text-field";
import { Show, splitProps, type JSX, type Ref } from "solid-js";
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
	const [local, others] = splitProps(props, [
		"description",
		"label",
		"errorMessage",
		"placeholder",
		"ref",
		"slotClasses",
		"classes",
	]);

	const [inputProps, rootProps] = splitProps(others, INPUT_KEYS);

	return (
		<P.Root
			class={mergeClasses(local.slotClasses?.root, local.classes?.root)}
			{...rootProps}
		>
			<Show when={local.label} keyed={false}>
				{label => (
					<P.Label class={mergeClasses(local.slotClasses?.label, local.classes?.label)}>
						{label()}
					</P.Label>
				)}
			</Show>

			<P.Field>
				<P.Input
					{...inputProps}
					class={mergeClasses(local.slotClasses?.input, local.classes?.input)}
					placeholder={local.placeholder}
					ref={local.ref}
				/>
				<P.Controls />
			</P.Field>

			<Show when={local.description} keyed={false}>
				{description => (
					<P.Description class={local.classes?.description}>
						{description()}
					</P.Description>
				)}
			</Show>
			<Show
				when={props.validationState === "invalid" && local.errorMessage}
				keyed={false}
			>
				{errorMessage => (
					<P.ErrorMessage
						class={mergeClasses(
							local.slotClasses?.errorLabel,
							local.classes?.errorMessage,
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
