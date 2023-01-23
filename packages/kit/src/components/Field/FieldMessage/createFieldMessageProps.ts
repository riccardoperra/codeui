import { description } from "./FieldMessage.css";
import { PolymorphicProps } from "@kobalte/utils/dist/types/polymorphic";
import { mergeProps } from "solid-js";
import { mergeClasses } from "../../../utils/css";

export function createFieldMessageProps<T extends PolymorphicProps<"div">>(props: T) {
	return mergeProps(props, {
		get class() {
			return mergeClasses(props.class, description);
		},
	});
}
