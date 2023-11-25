import { label } from "./FieldLabel.css";
import { mergeProps, ValidComponent } from "solid-js";
import { mergeClasses } from "../../../utils/css";
import { PolymorphicProps } from "@kobalte/core";

export function createFieldLabelProps<TValidComponent extends ValidComponent = "label">(
	props: PolymorphicProps<TValidComponent>,
) {
	return mergeProps(props, {
		get class() {
			return mergeClasses(props.class, label);
		},
	});
}
