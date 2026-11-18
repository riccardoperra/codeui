import type { StackStyleOptions } from "../generated-appearance/stack";
import { root } from "../components/Stack/Stack.css";
export type Gap = Exclude<NonNullable<StackStyleOptions["gap"]>, "auto">;
export type StackVariants = Omit<StackStyleOptions, "class" | "gap" | "wrap"> & {
	gap?: Gap;
	wrap?: boolean;
};
export const stackParts = { root: "stack-root" } as const;
export type StackPart = keyof typeof stackParts;
export type StackClasses = Partial<Record<StackPart, string>>;
export type StackStyles = { root: () => string };
export const stackStyles: StackStyles = {
	root: root,
};
