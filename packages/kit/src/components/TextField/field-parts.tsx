import { fieldStyleProps } from "@codeui/styles/field";
import type { PolymorphicProps } from "@kobalte/core/polymorphic";
import * as K from "@kobalte/core/text-field";
import { createContext, createUniqueId, merge, useContext, omit } from "solid-js";
import { mergeClasses } from "../../utils/css";
import type { BaseFieldProps } from "../Field/createBaseFieldProps";
import { baseFieldVariants } from "../Field/Field.css";
import { errorMessage } from "../Field/FieldError/FieldError.css";
import { createFieldLabelProps } from "../Field/FieldLabel/createFieldLabelProps";
import { createFieldMessageProps } from "../Field/FieldMessage/createFieldMessageProps";

const defaultFieldSize = fieldStyleProps()["data-size"];

type Appearance = NonNullable<BaseFieldProps>;
export type FieldRootProps = PolymorphicProps<"div", K.TextFieldRootProps<"div">> &
	Appearance & {
		/** ID shared by the input and its label. */
		inputId?: string;
	};

const FieldContext = createContext<{
	inputId: () => string;
	size: () => Appearance["size"];
	variant: () => Appearance["variant"];
}>();

export function useFieldParts() {
	const context = useContext(FieldContext);
	if (!context) throw new Error("Field parts must be rendered inside their Root.");
	return context;
}

export function FieldRoot(props: FieldRootProps & { marker: string; baseClass: string }) {
	const others = omit(
		props,
		"marker",
		"baseClass",
		"inputId",
		"size",
		"variant",
		"class",
	);
	const generatedId = createUniqueId();
	return (
		<FieldContext
			value={{
				inputId: () => props.inputId ?? `${others.id ?? generatedId}-input`,
				size: () => props.size ?? defaultFieldSize,
				variant: () => props.variant,
			}}
		>
			<K.Root
				data-cui={props.marker}
				data-field-size={props.size ?? defaultFieldSize}
				class={mergeClasses(props.baseClass, props.class)}
				{...others}
			/>
		</FieldContext>
	);
}

export type FieldInputProps = Omit<
	PolymorphicProps<"input", K.TextFieldInputProps<"input">>,
	"id" | "size"
> &
	Appearance;
export type FieldTextAreaProps = Omit<
	PolymorphicProps<"textarea", K.TextFieldTextAreaProps<"textarea">>,
	"id"
> &
	Appearance;

export function FieldInput(props: FieldInputProps & { baseClass: string }) {
	const field = useFieldParts();
	const others = omit(props, "baseClass", "size", "variant", "class");
	return (
		<K.Input
			{...others}
			id={field.inputId()}
			data-cui="textfield-input"
			data-size={props.size ?? field.size() ?? defaultFieldSize}
			data-variant={props.variant ?? field.variant() ?? "filled"}
			class={mergeClasses(baseFieldVariants(), props.baseClass, props.class)}
		/>
	);
}

export function FieldTextArea(props: FieldTextAreaProps & { baseClass: string }) {
	const field = useFieldParts();
	const others = omit(props, "baseClass", "size", "variant", "class");
	return (
		<K.TextArea
			{...others}
			id={field.inputId()}
			data-cui="textfield-input"
			data-size={props.size ?? field.size() ?? defaultFieldSize}
			data-variant={props.variant ?? field.variant() ?? "filled"}
			class={mergeClasses(baseFieldVariants(), props.baseClass, props.class)}
		/>
	);
}

export type LabelProps = Parameters<typeof K.Label>[0];
export function Label(props: LabelProps) {
	const field = useFieldParts();
	const labelProps = createFieldLabelProps(
		merge(
			{
				get for() {
					return field.inputId();
				},
			},
			props,
		),
	);
	return <K.Label data-cui="textfield-label" {...labelProps} />;
}

export type DescriptionProps = Parameters<typeof K.Description>[0];
export function Description(props: DescriptionProps) {
	return (
		<K.Description data-cui="textfield-description" {...createFieldMessageProps(props)} />
	);
}

export type ErrorMessageProps = Parameters<typeof K.ErrorMessage>[0];
export function ErrorMessage(props: ErrorMessageProps) {
	const others = omit(props, "class");
	return (
		<K.ErrorMessage
			data-cui="textfield-error-message"
			{...others}
			class={mergeClasses(errorMessage, props.class)}
		/>
	);
}
