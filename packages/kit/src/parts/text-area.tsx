import "@codeui/styles/theme.css";
import "@codeui/styles/textarea.css";
import * as styles from "../components/TextArea/TextArea.css";
import {
	FieldRoot,
	FieldTextArea,
	type FieldRootProps,
	type FieldTextAreaProps,
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

export type InputProps = FieldTextAreaProps;
export function Input(props: InputProps) {
	return <FieldTextArea baseClass={styles.textArea} {...props} />;
}
