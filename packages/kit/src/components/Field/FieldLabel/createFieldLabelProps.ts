import { label } from "./FieldLabel.css";
import { mergeProps } from "solid-js";
import { mergeClasses } from "../../../utils/css";
import { PolymorphicProps } from "@kobalte/core";

export function createFieldLabelProps<T extends PolymorphicProps<"label">>(props: T) {
	return mergeProps(props, {
		get class() {
			return mergeClasses(props.class, label);
		},
	});
}
