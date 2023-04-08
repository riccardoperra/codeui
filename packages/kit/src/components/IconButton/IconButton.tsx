import { Button, ButtonProps as CoreButtonProps } from "../Button/Button";
import { ParentProps } from "solid-js";
import * as styles from "./IconButton.css";

export type IconButtonProps = Omit<
	CoreButtonProps & {
		"aria-label": string;
	},
	"leftIcon"
>;

export function IconButton(props: ParentProps<IconButtonProps>) {
	return <Button class={styles.iconButton} data-cui="icon-button" {...props} />;
}
