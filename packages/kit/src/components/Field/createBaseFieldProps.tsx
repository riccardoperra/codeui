import "@codeui/styles/theme.css";
import "@codeui/styles/field.css";
import { createUniqueId, type Accessor, type JSX } from "solid-js";
import * as styles from "./Field.css";

export type BaseFieldProps = styles.BaseFieldVariants;

type BaseFieldStyling = {
	baseStyle(): string;
	attributes: {
		"data-size": NonNullable<NonNullable<BaseFieldProps>["size"]>;
		"data-variant": NonNullable<NonNullable<BaseFieldProps>["variant"]>;
	};
};

export function createBaseFieldProps(
	props: BaseFieldProps,
	field: Accessor<FieldContent & { inputId?: string; id?: string }>,
): BaseFieldStyling & { ids: ReturnType<typeof createFieldIds> };
export function createBaseFieldProps(
	props: BaseFieldProps,
): BaseFieldStyling & { ids: undefined };
export function createBaseFieldProps(
	props: BaseFieldProps,
	field?: Accessor<FieldContent & { inputId?: string; id?: string }>,
) {
	return {
		ids: field ? createFieldIds(field) : undefined,
		baseStyle: styles.baseFieldVariants,
		attributes: {
			get "data-size"() {
				return props?.size ?? "sm";
			},
			get "data-variant"() {
				return props?.variant ?? "filled";
			},
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
