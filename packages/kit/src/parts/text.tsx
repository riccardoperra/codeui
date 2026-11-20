import "@codeui/styles/theme.css";
import "@codeui/styles/text.css";
import { omit } from "solid-js";
import {
	type ComponentProps,
	type JSX,
	type ValidComponent,
	dynamic,
} from "@solidjs/web";

import { tokens } from "../foundation/cui.css";
import { root } from "../components/Text/Text.css";
import { mergeClasses } from "../utils/css";

import {
	type TextVariants,
	textParts,
	type TextPart,
	type TextClasses,
	type TextStyles,
} from "@codeui/styles/text";
export {
	type TextVariants,
	textParts,
	type TextPart,
	type TextClasses,
	type TextStyles,
	textStyles,
} from "@codeui/styles/text";
export type TextProps<T extends ValidComponent = "span"> = TextVariants & {
	as?: T;
	children?: JSX.Element;
	class?: string;
	classes?: TextClasses;
} & Omit<ComponentProps<T>, keyof TextVariants | "as" | "children" | "class" | "classes">;
export type RootProps<T extends ValidComponent = "span"> = TextProps<T>;

export function Root<T extends ValidComponent = "span">(props: TextProps<T>) {
	const others = omit(props, "as", "class", "classes", "size", "weight", "tone");
	const Element = dynamic(() => props.as ?? "span");
	return (
		<Element
			{...others}
			data-cui={textParts.root}
			class={mergeClasses(root(), props.classes?.root, props.class)}
			data-size={props.size ?? "sm"}
			data-weight={props.weight ?? "normal"}
			data-tone={props.tone ?? "default"}
		/>
	);
}
