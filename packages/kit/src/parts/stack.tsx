import "@codeui/styles/theme.css";
import "@codeui/styles/stack.css";
import { omit } from "solid-js";
import {
	type ComponentProps,
	type JSX,
	type ValidComponent,
	dynamic,
} from "@solidjs/web";

import { root } from "../components/Stack/Stack.css";
import { mergeClasses } from "../utils/css";

import {
	type Gap,
	type StackVariants,
	stackParts,
	type StackPart,
	type StackClasses,
	type StackStyles,
} from "@codeui/styles/stack";
export {
	type Gap,
	type StackVariants,
	stackParts,
	type StackPart,
	type StackClasses,
	type StackStyles,
	stackStyles,
} from "@codeui/styles/stack";
export type StackProps<T extends ValidComponent = "div"> = StackVariants & {
	as?: T;
	children?: JSX.Element;
	style?: string | JSX.CSSProperties;
	class?: string;
	classes?: StackClasses;
} & Omit<
		ComponentProps<T>,
		keyof StackVariants | "as" | "children" | "class" | "classes" | "style"
	>;
export type RootProps<T extends ValidComponent = "div"> = StackProps<T>;

export function Root<T extends ValidComponent = "div">(props: StackProps<T>) {
	const others = omit(
		props,
		"as",
		"class",
		"classes",
		"gap",
		"align",
		"justify",
		"direction",
		"wrap",
		"style",
	);
	const Element = dynamic(() => props.as ?? "div");
	return (
		<Element
			{...others}
			data-cui={stackParts.root}
			class={mergeClasses(root(), props.classes?.root, props.class)}
			data-gap={props.gap ?? "2"}
			data-align={props.align ?? "stretch"}
			data-justify={props.justify ?? "start"}
			data-direction={props.direction ?? "column"}
			data-wrap={props.wrap ? "true" : "false"}
			style={props.style || undefined}
		/>
	);
}
