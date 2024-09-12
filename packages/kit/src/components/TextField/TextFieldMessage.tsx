import { TextField as KTextField } from "@kobalte/core/text-field";
import { createFieldMessageProps } from "../Field/FieldMessage/createFieldMessageProps";

type TextFieldLabelProps = Parameters<(typeof KTextField)["Description"]>[0] & {};

// TODO: this is bad
export function TextFieldMessage(props: TextFieldLabelProps) {
	const fieldLabelProps = createFieldMessageProps(props);

	return <KTextField.Description {...fieldLabelProps} />;
}
