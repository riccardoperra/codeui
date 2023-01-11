import { Button as KButton, ButtonOptions } from "@kobalte/core";
import { ParentProps, splitProps } from "solid-js";
import * as styles from "./Button.css";

export type ButtonProps = ButtonOptions & styles.ButtonVariants;

export function Button(props: ParentProps<ButtonProps>) {
	const [local, others] = splitProps(props, ["size", "theme"]);
	return (
		<KButton
			data-cui="button"
			data-theme={local.theme}
			data-size={local.size}
			class={styles.button({
				size: local.size,
				theme: local.theme,
			})}
			{...others}
		/>
	);
}
