import { description } from "./FieldMessage.css";
import { mergeProps } from "solid-js";
import { mergeClasses } from "../../../utils/css";
import { PolymorphicProps } from "@kobalte/core";

export function createFieldMessageProps<T extends PolymorphicProps<"div">>(props: T) {
	return mergeProps(props, {
		get class() {
			return mergeClasses(props.class, description);
		},
	});
}
