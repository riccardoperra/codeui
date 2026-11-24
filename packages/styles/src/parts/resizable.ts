import type { ResizableStyleOptions } from "../generated-appearance/resizable";
import * as styles from "../components/Resizable/Resizable.css";
export const resizableParts = {
	root: "resizable",
	panel: "resizable-panel",
	handle: "resizable-handle",
} as const;

export type ResizablePart = keyof typeof resizableParts;
export type ResizableClasses = Partial<Record<ResizablePart, string>>;
export type ResizableOrientation = NonNullable<ResizableStyleOptions["orientation"]>;
export type ResizableStyles = { [P in ResizablePart]: () => string };

export const resizableStyles: ResizableStyles = {
	root: () => "",
	panel: () => "",
	handle: styles.handle,
};
