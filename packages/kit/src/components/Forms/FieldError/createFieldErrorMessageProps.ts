import { errorMessage } from "./FieldError.css";
import { JSX, mergeProps, splitProps } from "solid-js";

export type FieldWithErrorMessageSupport = {
	errorMessage?: JSX.Element;
};

export function createFieldErrorMessageProps<T extends FieldWithErrorMessageSupport>(
	props: T,
) {
	const [local] = splitProps(props, ["errorMessage"]);

	return mergeProps(local, {
		get class() {
			return errorMessage;
		},
	});
}
