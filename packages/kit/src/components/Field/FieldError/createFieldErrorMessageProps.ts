import { pickProps } from "../../../utils/pick-props";
import { errorMessage } from "./FieldError.css";
import { merge } from "solid-js";
import { JSX } from "@solidjs/web";

export type FieldWithErrorMessageSupport = {
	errorMessage?: JSX.Element;
};

export function createFieldErrorMessageProps<T extends FieldWithErrorMessageSupport>(
	props: T,
) {
	const local = pickProps(props, "errorMessage");

	return merge(local, {
		get class() {
			return errorMessage;
		},
	});
}
