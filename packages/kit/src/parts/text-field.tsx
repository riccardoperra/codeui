import "@codeui/styles/theme.css";
import "@codeui/styles/textfield.css";
import * as styles from "../components/TextField/TextField.css";
import {
	FieldInput,
	FieldRoot,
	type FieldInputProps,
	type FieldRootProps,
} from "../components/TextField/field-parts";

export {
	Description,
	ErrorMessage,
	Label,
	type DescriptionProps,
	type ErrorMessageProps,
	type LabelProps,
} from "../components/TextField/field-parts";

export type RootProps = FieldRootProps;
export function Root(props: RootProps) {
	return (
		<FieldRoot marker="textfield" baseClass={styles.baseFieldContainer} {...props} />
	);
}

export type InputProps = FieldInputProps;
export function Input(props: InputProps) {
	return <FieldInput baseClass={styles.textField} {...props} />;
}
