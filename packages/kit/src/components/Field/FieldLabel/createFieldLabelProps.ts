import { label } from "./FieldLabel.css";
import { merge } from "solid-js";
import { ValidComponent } from "@solidjs/web";
import { mergeClasses } from "../../../utils/css";
import { PolymorphicProps } from "@kobalte/core/polymorphic";

export function createFieldLabelProps<TValidComponent extends ValidComponent = "label">(
	props: PolymorphicProps<TValidComponent>,
) {
	return merge(props, {
		get class() {
			return mergeClasses(props.class, label);
		},
	});
}
