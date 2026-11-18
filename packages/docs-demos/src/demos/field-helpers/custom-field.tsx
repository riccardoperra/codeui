import {
	type BaseFieldProps,
	createBaseFieldProps,
	createFieldErrorMessageProps,
	createFieldLabelProps,
	type FieldWithErrorMessageSupport,
	fieldStyles,
	textFieldStyles,
} from "@codeui/kit";
import { createSignal, For, type JSX, Show } from "solid-js";

type ExportFormatFieldProps = BaseFieldProps &
	FieldWithErrorMessageSupport & {
		label: JSX.Element;
		description?: JSX.Element;
		value: string;
		onChange: (value: string) => void;
	};

/** A native select that looks and reads like the kit fields. */
function ExportFormatField(props: ExportFormatFieldProps) {
	const field = createBaseFieldProps(props, () => props);
	const labelProps = createFieldLabelProps<"label">({
		get for() {
			return field.ids.input();
		},
		get id() {
			return field.ids.label();
		},
	});
	const errorProps = createFieldErrorMessageProps(props);
	const describedBy = () =>
		[props.description && field.ids.description(), props.errorMessage && field.ids.errorMessage()]
			.filter(Boolean)
			.join(" ") || undefined;

	return (
		<div class={textFieldStyles.baseFieldContainer} data-field-size={props.size ?? "md"}>
			<label {...labelProps}>{props.label}</label>
			<select
				id={field.ids.input()}
				{...field.attributes}
				class={`${field.baseStyle()} ${textFieldStyles.textField}`}
				value={props.value}
				data-invalid={props.errorMessage ? "" : undefined}
				aria-invalid={props.errorMessage ? true : undefined}
				aria-describedby={describedBy()}
				onChange={event => props.onChange(event.currentTarget.value)}
			>
				<For each={["png", "jpeg", "svg"]}>{format => <option value={format}>{format.toUpperCase()}</option>}</For>
			</select>
			<Show when={props.description}>
				<div
					id={field.ids.description()}
					style={{ color: fieldStyles.baseFieldVars.descriptionColor, "font-size": "var(--cui-font-size-xs)" }}
				>
					{props.description}
				</div>
			</Show>
			<Show when={errorProps.errorMessage}>
				<div id={field.ids.errorMessage()} class={errorProps.class}>
					{errorProps.errorMessage}
				</div>
			</Show>
		</div>
	);
}

export default function CustomField() {
	const [format, setFormat] = createSignal("png");
	return (
		<div style={{ width: "320px" }}>
			<ExportFormatField
				label="Export format"
				description="SVG keeps the text selectable."
				value={format()}
				onChange={setFormat}
				errorMessage={format() === "jpeg" ? "JPEG drops the transparent background." : undefined}
			/>
		</div>
	);
}
