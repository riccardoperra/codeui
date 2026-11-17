import "@codeui/styles/theme.css";
import "@codeui/styles/field.css";
import { createUniqueId, type Accessor, type JSX } from "solid-js";
import * as styles from "./Field.css";
import { mergeClasses } from "../../utils/css";

export type BaseFieldProps = styles.BaseFieldVariants;

export function createBaseFieldProps(
	props: BaseFieldProps,
	field: Accessor<FieldContent & { inputId?: string; id?: string }>,
): { ids: ReturnType<typeof createFieldIds>; baseStyle: () => string };
export function createBaseFieldProps(props: BaseFieldProps): {
	ids: undefined;
	baseStyle(): string;
};
export function createBaseFieldProps(
	props: BaseFieldProps,
	field?: Accessor<FieldContent & { inputId?: string; id?: string }>,
) {
	return {
		ids: field ? createFieldIds(field) : undefined,
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

export type FieldContent = {
	label?: JSX.Element;
	description?: JSX.Element;
	errorMessage?: JSX.Element;
};
export function createFieldIds(
	props: Accessor<FieldContent & { inputId?: string; id?: string }>,
) {
	const id = createUniqueId();
	const input = () => props().inputId ?? `${props().id ?? id}-input`;
	return {
		input,
		label: () => `${input()}-label`,
		description: () => `${input()}-description`,
		errorMessage: () => `${input()}-error`,
	};
}
