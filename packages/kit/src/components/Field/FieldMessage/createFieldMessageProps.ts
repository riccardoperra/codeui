import { description } from "./FieldMessage.css";
import { merge } from "solid-js";
import { JSX, ValidComponent } from "@solidjs/web";
import { mergeClasses } from "../../../utils/css";
import { PolymorphicProps } from "@kobalte/core/polymorphic";

export function createFieldMessageProps<TComponent extends ValidComponent = "div">(
	props: PolymorphicProps<TComponent, { children?: JSX.Element; class?: string }>,
) {
	return merge(props, {
		get class() {
			return mergeClasses(props.class, description);
		},
	});
}
