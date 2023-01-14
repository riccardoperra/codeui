import { TextField as KTextField } from "@kobalte/core";
import * as styles from "./TextField.css";

type TextFieldLabelProps = Parameters<(typeof KTextField)["Label"]>[0] & {};

export function TextFieldLabel(props: TextFieldLabelProps) {
	return <KTextField.Label class={styles.label} {...props} />;
}
