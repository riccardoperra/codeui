import * as styles from "./Button.css";
import { JSX, splitProps } from "solid-js";

export function ButtonIcon(props: JSX.IntrinsicElements["span"]) {
	return <span class={styles.buttonIcon} {...props} />;
}
