import { Button as KButton } from "@kobalte/core";
import { JSX, ParentProps, Show, splitProps } from "solid-js";
import * as styles from "./Button.css";
import { mergeClasses } from "../../utils/css";
import { ButtonIcon } from "./ButtonIcon";
import type { As } from "@kobalte/utils/dist/types/polymorphic";
import { PolymorphicProps } from "@kobalte/utils/dist/types/polymorphic";

export type ButtonProps<T extends As> = PolymorphicProps<T> &
	KButton.ButtonRootOptions &
	styles.ButtonVariants & {
		class?: string;
		leftIcon?: JSX.Element;
	};

export function Button<Type extends As = As>(props: ParentProps<ButtonProps<Type>>) {
	const [local, internal, others] = splitProps(
		props,
		["size", "theme", "pill"],
		["class", "children", "leftIcon"],
	);
	const classes = () =>
		mergeClasses(
			styles.button({
				size: local.size,
				theme: local.theme,
				pill: local.pill,
			}),
			internal.class,
		);

	return (
		<KButton.Root
			data-cui="button"
			data-theme={local.theme}
			data-size={local.size}
			class={classes()}
			{...others}
		>
			<Show when={internal.leftIcon} keyed={false}>
				<ButtonIcon>{internal.leftIcon}</ButtonIcon>
			</Show>

			{internal.children}
		</KButton.Root>
	);
}
