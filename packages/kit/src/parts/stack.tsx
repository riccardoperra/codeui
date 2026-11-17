import "@codeui/styles/theme.css";
import "@codeui/styles/stack.css";
import { type ComponentProps, type JSX, type ValidComponent, splitProps } from "solid-js";
import { Dynamic } from "solid-js/web";
import { root } from "../components/Stack/Stack.css";
import { mergeClasses } from "../utils/css";

import { type Gap, type StackVariants, stackParts, type StackPart, type StackClasses, type StackStyles } from "@codeui/styles/stack";
export { type Gap, type StackVariants, stackParts, type StackPart, type StackClasses, type StackStyles, stackStyles } from "@codeui/styles/stack";
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
	const [local, others] = splitProps(props, [
		"as",
		"class",
		"classes",
		"gap",
		"align",
		"justify",
		"direction",
		"wrap",
		"style",
	]);
	return (
		<Dynamic
			{...others}
			component={local.as ?? "div"}
			data-cui={stackParts.root}
			class={mergeClasses(root(), local.classes?.root, local.class)}
			data-gap={local.gap ?? "2"}
			data-align={local.align ?? "stretch"}
			data-justify={local.justify ?? "start"}
			data-direction={local.direction ?? "column"}
			data-wrap={local.wrap ?? false}
			style={local.style || undefined}
		/>
	);
}
