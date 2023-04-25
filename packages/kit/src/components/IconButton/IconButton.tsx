import { mergeClasses } from "../../utils/css";
import { Button, ButtonProps as CoreButtonProps } from "../Button/Button";
import { ParentProps, splitProps } from "solid-js";
import * as styles from "./IconButton.css";

export type IconButtonProps = Omit<
	CoreButtonProps & {
		"aria-label": string;
	},
	"leftIcon"
>;

export function IconButton(props: ParentProps<IconButtonProps>) {
	const [local, others] = splitProps(props, ["class"]);

	return (
		<Button
			class={mergeClasses(styles.iconButton, local.class)}
			data-cui="icon-button"
			{...others}
		/>
	);
}
