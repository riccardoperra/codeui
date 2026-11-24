import type { ResizableHandleProps, ResizablePanelProps, ResizableProps } from "@codeui/kit";
import type { PropNotes } from "./notes";

/** Kobalte resizable root options, plus the kit classes. */
export type Resizable = Pick<
	ResizableProps,
	"orientation" | "sizes" | "onSizesChange" | "initialSizes" | "keyboardDelta" | "handleCursorStyle" | "classes" | "class"
>;

/** Kobalte panel options, plus the kit classes. */
export type ResizablePanel = Pick<
	ResizablePanelProps,
	| "initialSize"
	| "minSize"
	| "maxSize"
	| "collapsible"
	| "collapsedSize"
	| "collapseThreshold"
	| "onResize"
	| "onCollapse"
	| "onExpand"
	| "panelId"
	| "classes"
	| "class"
>;

/** Kobalte handle options, plus the kit classes. */
export type ResizableHandle = Pick<
	ResizableHandleProps,
	| "altKey"
	| "startIntersection"
	| "endIntersection"
	| "onHandleDragStart"
	| "onHandleDrag"
	| "onHandleDragEnd"
	| "disabled"
	| "classes"
	| "class"
>;

export const notes = {
	Resizable: {
		orientation: { default: '"horizontal"', description: "Lays the panels out in a row or a column." },
		sizes: { description: "Controlled panel sizes, as fractions of the root that add up to 1." },
		onSizesChange: { description: "Called with the new fractions when a panel resizes." },
		initialSizes: { description: "Panel sizes on first render, by index. A panel's own initialSize wins." },
		keyboardDelta: { default: "0.1", description: 'Step of one arrow key press, as a fraction or a "40px" string.' },
		handleCursorStyle: { default: "true", description: "Sets the resize cursor on the whole page while a handle is hovered or dragged." },
		classes: { description: "Class for the root." },
		class: { description: "Class merged on the root." },
	},
	ResizablePanel: {
		initialSize: { description: 'Size on first render, as a fraction or a "240px" string. Without it, the panel takes the space the others leave.' },
		minSize: { default: "0", description: 'Smallest size, as a fraction or a "200px" string.' },
		maxSize: { default: "1", description: 'Largest size, as a fraction or a "360px" string.' },
		collapsible: { default: "false", description: "Lets the panel collapse to collapsedSize." },
		collapsedSize: { default: "0", description: "Size of the collapsed panel." },
		collapseThreshold: { default: "0.05", description: "How far past minSize a drag must go to collapse the panel." },
		onResize: { description: "Called with the new size as a fraction." },
		onCollapse: { description: "Called when the panel collapses." },
		onExpand: { description: "Called when the panel expands." },
		panelId: { default: "createUniqueId()", description: "Panel id. The handle points at it with aria-controls." },
		classes: { description: "Class for the panel." },
		class: { description: "Class merged on the panel." },
	},
	ResizableHandle: {
		altKey: { default: "true", description: 'With Alt held, resizes the panels on both sides of the next panel. "only" always does.' },
		startIntersection: { description: "A crossing handle at the start edge, to resize both directions at once." },
		endIntersection: { description: "A crossing handle at the end edge, to resize both directions at once." },
		onHandleDragStart: { description: "Called on pointer down. Call preventDefault to stop the drag." },
		onHandleDrag: { description: "Called while the handle moves." },
		onHandleDragEnd: { description: "Called when the drag ends." },
		disabled: { default: "false", description: "Stops dragging and keyboard resizing." },
		classes: { description: "Class for the handle." },
		class: { description: "Class merged after the kit styles on the handle." },
	},
} satisfies PropNotes;
