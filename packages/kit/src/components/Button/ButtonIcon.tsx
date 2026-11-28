import "@codeui/styles/theme.css";
import "@codeui/styles/button.css";
import * as styles from "./Button.css";
import { JSX } from "@solidjs/web";

export function ButtonIcon(props: JSX.IntrinsicElements["span"]) {
	return <span class={styles.buttonIcon} {...props} />;
}
