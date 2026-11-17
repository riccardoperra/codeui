import "@codeui/styles/theme.css";
import "@codeui/styles/button.css";
import "@codeui/styles/icon-button.css";
import { mergeClasses } from "../../utils/css";
import { Button } from "../Button/Button";
import { splitProps, ValidComponent } from "solid-js";
import * as styles from "./IconButton.css";
import { PolymorphicProps } from "@kobalte/core/polymorphic";
import { ButtonRootProps as KButtonRootProps } from "@kobalte/core/button";
import { type ButtonVariants } from "../Button/Button.css";

export type IconButtonProps<T extends ValidComponent = "button"> = KButtonRootProps<T> &
	ButtonVariants & {
	class?: string;
	loading?: boolean;
	"aria-label": string;
};

export function IconButton<T extends ValidComponent = "button">(props: PolymorphicProps<T, IconButtonProps<T>>) {
	const [local, others] = splitProps(props, ["class"]);

	return (
		<Button
			data-cui={styles.iconButtonPart}
			{...others as KButtonRootProps}
			class={mergeClasses(styles.iconButton, local.class)}
		/>
	);
}
