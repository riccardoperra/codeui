import { TextField as KTextField } from "@kobalte/core";
import { createFieldMessageProps } from "../Field/FieldMessage/createFieldMessageProps";

type TextFieldLabelProps = Parameters<(typeof KTextField)["Description"]>[0] & {};

export function NumberFieldMessage(props: TextFieldLabelProps) {
	const fieldLabelProps = createFieldMessageProps(props);

	return <KTextField.Description {...fieldLabelProps} />;
}
