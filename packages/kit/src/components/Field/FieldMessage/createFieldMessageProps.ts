import { description } from "./FieldMessage.css";
import { mergeProps, splitProps, ValidComponent } from "solid-js";
import { mergeClasses } from "../../../utils/css";
import { PolymorphicProps } from "@kobalte/core";

export function createFieldMessageProps<TComponent extends ValidComponent = "div">(
	props: PolymorphicProps<TComponent>,
) {
	const [local] = splitProps(props, []);
	return mergeProps(local, {
		get class() {
			return mergeClasses(props.class, description);
		},
	});
}
