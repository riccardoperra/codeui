import * as styles from "./Field.css";
import { mergeClasses } from "../../utils/css";

export type BaseFieldProps = styles.BaseFieldVariants;

export function createBaseFieldProps(props: BaseFieldProps) {
	return {
		baseStyle() {
			return mergeClasses(
				styles.baseFieldVariants({
					size: props?.size,
					theme: props?.theme,
				}),
			);
		},
	};
}
