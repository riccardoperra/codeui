import { createDisclosureState, Select as KSelect } from "@kobalte/core";
import { createEffect, createSignal, JSX, ParentProps, Show, splitProps } from "solid-js";
import { AnimationContextProvider, useAnimationContext } from "../../utils/animation";
import { GetKobalteParams } from "../../utils/types";
import { animate } from "motion";
import * as styles from "./Select.css";
import { createFieldLabelProps } from "../Forms/FieldLabel/createFieldLabelProps";
import { createFieldMessageProps } from "../Forms/FieldMessage/createFieldMessageProps";
import { createFieldErrorMessageProps } from "../Forms/FieldError/createFieldErrorMessageProps";

type SelectProps = GetKobalteParams<typeof KSelect.Root> &
	styles.SelectFieldVariants & {
		"aria-label": string;
		placeholder?: string;

		description?: string;
		label?: JSX.Element;
		errorMessage?: JSX.Element;
	};

function SelectorIcon(props: JSX.IntrinsicElements["svg"]): JSX.Element {
	return (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			fill="none"
			viewBox="0 0 24 24"
			stroke="currentColor"
			width={"1.1em"}
			height={"1.1em"}
			{...props}
		>
			<path
				stroke-linecap="round"
				stroke-linejoin="round"
				stroke-width="2"
				d="M8 9l4-4 4 4m0 6l-4 4-4-4"
			/>
		</svg>
	);
}

function SelectContent(props: ParentProps<GetKobalteParams<typeof KSelect.Content>>) {
	const { setRef, registerOnExit, registerOnEnter } = useAnimationContext();

	registerOnEnter(ref =>
		animate(ref, {
			opacity: [0, 1],
			transform: ["translateY(-10px)", "translateY(0px)"],
		}),
	);

	registerOnExit(ref =>
		animate(ref, {
			opacity: 0,
			transform: "translateY(-10px)",
		}),
	);

	return <KSelect.Content class={styles.content} {...props} ref={setRef} />;
}

export function SelectSeparator(
	props: ParentProps<GetKobalteParams<(typeof KSelect)["Separator"]>>,
) {
	return <KSelect.Separator class={styles.separator} {...props} />;
}

export function SelectItem(
	props: ParentProps<GetKobalteParams<(typeof KSelect)["Item"]>>,
) {
	return <KSelect.Item class={styles.item} {...props} />;
}

export function Select(props: ParentProps<SelectProps>) {
	const [local, others] = splitProps(props, [
		"aria-label",
		"placeholder",
		"children",
		"size",
		"theme",
		"errorMessage",
		"description",
		"label",
	]);
	const [open, setOpen] = createSignal<boolean>(false);
	const internalState = createDisclosureState(props);

	createEffect(() => {
		if (internalState.isOpen()) {
			setOpen(true);
		}
	});

	const labelProps = createFieldLabelProps({});
	const descriptionProps = createFieldMessageProps({});
	const errorProps = createFieldErrorMessageProps(props);

	return (
		<AnimationContextProvider
			state={internalState.isOpen()}
			onExitAnimationFinish={() => setOpen(false)}
		>
			<KSelect.Root
				{...others}
				isOpen={open()}
				onOpenChange={value => internalState.setIsOpen(value)}
			>
				<div class={styles.field}>
					<Show when={local.label} keyed={false}>
						<KSelect.Label {...labelProps}>{local.label}</KSelect.Label>
					</Show>
					<KSelect.Trigger
						aria-label={local["aria-label"]}
						class={styles.selectField({
							size: local.size,
							theme: local.theme,
						})}
					>
						<KSelect.Value placeholder={local.placeholder} />
						<KSelect.Icon>
							<SelectorIcon />
						</KSelect.Icon>
					</KSelect.Trigger>
					<Show when={local.description} keyed={false}>
						<KSelect.Description {...descriptionProps}>
							{local.description}
						</KSelect.Description>
					</Show>
					<Show when={local.errorMessage} keyed={false}>
						<KSelect.ErrorMessage {...errorProps}>
							{local.errorMessage}
						</KSelect.ErrorMessage>
					</Show>
				</div>
				<KSelect.Portal>
					<SelectContent>
						<KSelect.Listbox>{local.children}</KSelect.Listbox>
					</SelectContent>
				</KSelect.Portal>
			</KSelect.Root>
		</AnimationContextProvider>
	);
}
