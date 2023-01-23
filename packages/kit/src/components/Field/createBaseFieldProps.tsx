import * as styles from "./Field.css";
import { mergeClasses } from "../../utils/css";

export type BaseFieldProps = styles.BaseFieldVariants;

export function createBaseFieldProps(props: BaseFieldProps) {
	styles.baseField;
	return {
		baseStyle() {
			return mergeClasses(
				styles.baseField,
				styles.baseFieldVariants({
					size: props?.size,
					theme: props?.theme,
				}),
			);
		},
	};
}
