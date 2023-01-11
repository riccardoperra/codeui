import * as styles from "./Button.css";
import { JSX, splitProps } from "solid-js";

export function ButtonIcon(props: JSX.IntrinsicElements["span"]) {
	const [local, others] = splitProps(props, ["class", "children"]);

	return (
		<span class={styles.buttonIcon} {...others}>
			{local.children}
		</span>
	);
}
