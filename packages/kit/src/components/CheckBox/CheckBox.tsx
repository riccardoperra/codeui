import type { CheckboxRootOptions } from "@kobalte/core/checkbox";
import { Show, splitProps, type JSX, type Ref } from "solid-js";
import * as P from "../../parts/checkbox";
import type { SlotProp } from "../../utils/component";
import type { FieldWithErrorMessageSupport } from "../Field/FieldError/createFieldErrorMessageProps";

type CheckBoxSlot = "root" | "input" | "label" | "errorLabel" | "control";

export type CheckBoxProps = CheckboxRootOptions &
	Pick<P.RootProps, "size" | "theme"> &
	FieldWithErrorMessageSupport &
	SlotProp<CheckBoxSlot> & {
		description?: string;
		label?: JSX.Element;
		ref?: Ref<HTMLInputElement>;
	};

export function Checkbox(props: CheckBoxProps) {
	const [local, others] = splitProps(props, [
		"description",
		"size",
		"label",
		"theme",
		"errorMessage",
		"ref",
		"slotClasses",
	]);

	return (
		<P.Root
			size={local.size}
			theme={local.theme}
			class={local.slotClasses?.root}
			{...others}
		>
			<P.Input class={local.slotClasses?.input} ref={local.ref} />
			<P.Control size={local.size} theme={local.theme} class={local.slotClasses?.control}>
				<P.Indicator />
			</P.Control>

			<P.Content>
				<Show when={local.label} keyed={false}>
					{label => <P.Label class={local.slotClasses?.label}>{label()}</P.Label>}
				</Show>

				<Show when={local.description} keyed={false}>
					{description => <P.Description>{description()}</P.Description>}
				</Show>

				<Show
					when={props.validationState === "invalid" && local.errorMessage}
					keyed={false}
				>
					{errorMessage => (
						<P.ErrorMessage class={local.slotClasses?.errorLabel}>
							{errorMessage()}
						</P.ErrorMessage>
					)}
				</Show>
			</P.Content>
		</P.Root>
	);
}
