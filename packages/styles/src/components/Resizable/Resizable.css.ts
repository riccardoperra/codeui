export const handle = (): string => "cui-resizable-handle";
export const resizableVars = {
	handleSize: "var(--cui-resizable-handle-size)" as `var(--${string})`,
	handleLineColor: "var(--cui-resizable-handle-line-color)" as `var(--${string})`,
	handleLineActiveColor: "var(--cui-resizable-handle-line-active-color)" as `var(--${string})`,
	handleLineDraggingColor: "var(--cui-resizable-handle-line-dragging-color)" as `var(--${string})`,
	handleLineWidth: "var(--cui-resizable-handle-line-width)" as `var(--${string})`,
};
