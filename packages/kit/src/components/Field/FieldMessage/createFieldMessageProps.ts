import { description } from "./FieldMessage.css";
import { mergeProps, splitProps, JSX, ValidComponent } from "solid-js";
import { mergeClasses } from "../../../utils/css";
import { PolymorphicProps } from "@kobalte/core/polymorphic";

export function createFieldMessageProps<TComponent extends ValidComponent = "div">(
	props: PolymorphicProps<TComponent, { children?: JSX.Element; class?: string }>,
) {
	return mergeProps(props, {
		get class() {
			return mergeClasses(props.class, description);
		},
	});
}
