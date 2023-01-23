import { label } from "./FieldLabel.css";
import { PolymorphicProps } from "@kobalte/utils/dist/types/polymorphic";
import { mergeProps } from "solid-js";
import { mergeClasses } from "../../../utils/css";

export function createFieldLabelProps<T extends PolymorphicProps<"label">>(props: T) {
	return mergeProps(props, {
		get class() {
			return mergeClasses(props.class, label);
		},
	});
}
