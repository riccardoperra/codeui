import "@codeui/styles/theme.css";
import "@codeui/styles/text.css";
import { type ComponentProps, type JSX, type ValidComponent, splitProps } from "solid-js";
import { Dynamic } from "solid-js/web";
import { tokens } from "../foundation/cui.css";
import { root } from "../components/Text/Text.css";
import { mergeClasses } from "../utils/css";

import { type TextVariants, textParts, type TextPart, type TextClasses, type TextStyles } from "@codeui/styles/text";
export { type TextVariants, textParts, type TextPart, type TextClasses, type TextStyles, textStyles } from "@codeui/styles/text";
export type TextProps<T extends ValidComponent = "span"> = TextVariants & {
	as?: T;
	children?: JSX.Element;
	class?: string;
	classes?: TextClasses;
} & Omit<ComponentProps<T>, keyof TextVariants | "as" | "children" | "class" | "classes">;
export type RootProps<T extends ValidComponent = "span"> = TextProps<T>;

export function Root<T extends ValidComponent = "span">(props: TextProps<T>) {
	const [local, others] = splitProps(props, [
		"as",
		"class",
		"classes",
		"size",
		"weight",
		"tone",
	]);
	return (
		<Dynamic
			{...others}
			component={local.as ?? "span"}
			data-cui={textParts.root}
			class={mergeClasses(root(), local.classes?.root, local.class)}
			data-size={local.size ?? "sm"}
			data-weight={local.weight ?? "normal"}
			data-tone={local.tone ?? "default"}
		/>
	);
}
