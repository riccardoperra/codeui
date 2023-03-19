import { Button as KButton } from "@kobalte/core";
import { JSX, Show, splitProps } from "solid-js";
import * as styles from "./Button.css";
import { mergeClasses } from "../../utils/css";
import { ButtonIcon } from "./ButtonIcon";

export type ButtonProps = KButton.ButtonRootProps &
	styles.ButtonVariants & {
		class?: string;
		leftIcon?: JSX.Element;
	};

export function Button(props: ButtonProps) {
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
