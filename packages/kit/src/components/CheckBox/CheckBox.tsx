import type { CheckboxRootOptions } from "@kobalte/core/checkbox";
import { Show, type Ref, omit } from "solid-js";
import { type JSX } from "@solidjs/web";
import * as P from "../../parts/checkbox";
import type { SlotProp } from "../../utils/component";
import type { FieldWithErrorMessageSupport } from "../Field/FieldError/createFieldErrorMessageProps";

type CheckBoxSlot = "root" | "input" | "label" | "errorLabel" | "control";

export type CheckBoxProps = CheckboxRootOptions &
	Pick<P.RootProps, "size" | "variant"> &
	FieldWithErrorMessageSupport &
	SlotProp<CheckBoxSlot> & {
		description?: string;
		label?: JSX.Element;
		ref?: Ref<HTMLInputElement>;
	};

export function Checkbox(props: CheckBoxProps) {
	const others = omit(
		props,
		"description",
		"size",
		"label",
		"variant",
		"errorMessage",
		"ref",
		"slotClasses",
	);

	return (
		<P.Root
			size={props.size}
			variant={props.variant}
			class={props.slotClasses?.root}
			{...others}
		>
			<P.Input class={props.slotClasses?.input} ref={props.ref} />
			<P.Control
				size={props.size}
				variant={props.variant}
				class={props.slotClasses?.control}
			>
				<P.Indicator />
			</P.Control>

			<P.Content>
				<Show when={props.label} keyed={false}>
					{label => <P.Label class={props.slotClasses?.label}>{label()}</P.Label>}
				</Show>

				<Show when={props.description} keyed={false}>
					{description => <P.Description>{description()}</P.Description>}
				</Show>

				<Show
					when={props.validationState === "invalid" && props.errorMessage}
					keyed={false}
				>
					{errorMessage => (
						<P.ErrorMessage class={props.slotClasses?.errorLabel}>
							{errorMessage()}
						</P.ErrorMessage>
					)}
				</Show>
			</P.Content>
		</P.Root>
	);
}
