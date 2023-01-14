import { mergeClasses } from "../utils/css";
import { JSX } from "solid-js";
import * as textStyles from "./text.css";
import Accessor = JSX.Accessor;

export interface UseTextProps {
	size?: Accessor<keyof typeof textStyles.fontSize>;
	weight?: Accessor<keyof typeof textStyles.fontWeight>;
}

export function createTextClasses(props: UseTextProps) {
	const sizeClass = () => {
		const size = props.size?.();
		if (!size) {
			return undefined;
		}
		return textStyles.fontSize[size] ?? undefined;
	};

	const weightClass = () => {
		const weight = props.weight?.();
		if (!weight) {
			return undefined;
		}
		return textStyles.fontWeight[weight] ?? undefined;
	};

	return () => mergeClasses(sizeClass(), weightClass());
}
