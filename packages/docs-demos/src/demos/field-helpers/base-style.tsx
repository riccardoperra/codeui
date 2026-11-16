import { createBaseFieldProps, fieldStyles, textFieldStyles } from "@codeui/kit";

export default function BaseStyle() {
	const field = createBaseFieldProps({ size: "sm", theme: "filled" });
	return (
		<div class={fieldStyles.baseFieldTheme} style={{ width: "240px" }}>
			<input
				type="search"
				aria-label="Search snippets"
				placeholder="Search snippets"
				class={`${field.baseStyle()} ${textFieldStyles.textField}`}
			/>
		</div>
	);
}
