import { root } from "../components/Stack/Stack.css";
export type Gap =
	| "0"
	| "0.5"
	| "1"
	| "1.5"
	| "2"
	| "2.5"
	| "3"
	| "4"
	| "5"
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
export type StackStyles = { root: () => string };
export const stackStyles: StackStyles = {
	root: root,
};
