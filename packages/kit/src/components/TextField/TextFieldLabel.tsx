import { TextField as KTextField } from "@kobalte/core";
import { createFieldLabelProps } from "../Forms/FieldLabel/createFieldLabelProps";

type TextFieldLabelProps = Parameters<(typeof KTextField)["Label"]>[0] & {};

export function TextFieldLabel(props: TextFieldLabelProps) {
	const fieldLabelProps = createFieldLabelProps(props);

	return <KTextField.Label {...fieldLabelProps} />;
}
