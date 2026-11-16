import { type ComponentProps, type JSX, type ValidComponent, splitProps } from "solid-js";
import { Dynamic } from "solid-js/web";
import { tokens } from "../foundation/cui.css";
import { root } from "../components/Stack/Stack.css";
import { mergeClasses } from "../utils/css";

export type Gap =
	| "0"
	| "0.5"
	| "1"
	| "1.5"
	| "2"
	| "3"
	| "4"
	| "6"
	| "8"
	| "10"
	| "12"
	| "16"
	| "20"
	| "24"
	| "32"
	| "40"
	| "48"
	| "56"
	| "64"
	| "px";
export type StackVariants = {
	gap?: Gap;
	align?: "start" | "center" | "end" | "stretch" | "baseline";
	justify?: "start" | "center" | "end" | "between" | "around" | "evenly";
	direction?: "row" | "column";
	wrap?: boolean;
};
export const stackParts = { root: "stack-root" } as const;
export type StackPart = keyof typeof stackParts;
export type StackClasses = Partial<Record<StackPart, string>>;
export type StackStyles = { root: (variants?: StackVariants) => string };
export const stackStyles: StackStyles = { root: () => root };
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
	const gap = (): Gap => local.gap ?? "2";
	return (
		<Dynamic
			{...others}
			component={local.as ?? "div"}
			data-cui={stackParts.root}
			class={mergeClasses(root, local.classes?.root, local.class)}
			data-gap={local.gap ?? "2"}
			data-align={local.align ?? "stretch"}
			data-justify={local.justify ?? "start"}
			data-direction={local.direction ?? "column"}
			data-wrap={local.wrap ?? false}
			style={
				typeof local.style === "string"
					? `${local.style};--cui-stack-gap:${tokens.space[gap()]}`
					: { ...local.style, "--cui-stack-gap": tokens.space[gap()] }
			}
		/>
	);
}
