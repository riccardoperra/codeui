import { TextField as KTextField } from "@kobalte/core/text-field";
import { createFieldLabelProps } from "../Field/FieldLabel/createFieldLabelProps";

type TextFieldLabelProps = Parameters<(typeof KTextField)["Label"]>[0] & {};

export function TextAreaLabel(props: TextFieldLabelProps) {
	const fieldLabelProps = createFieldLabelProps(props);

	return <KTextField.Label {...fieldLabelProps} />;
}
