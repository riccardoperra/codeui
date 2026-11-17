import { recipe } from "../../recipe";
export const body: string = "cui-sheet-body";
export const closeButton: string = "cui-sheet-closeButton";
export const content = recipe({
	defaultClassName: "cui-sheet-content",
	variantClassNames: {
		side: {
			bottom: "cui-sheet-content_side_bottom",
			left: "cui-sheet-content_side_left",
			right: "cui-sheet-content_side_right",
		},
	},
	defaultVariants: { side: "bottom" },
});
export const description: string = "cui-sheet-description";
export const footer: string = "cui-sheet-footer";
export const handle: string = "cui-sheet-handle";
export const header: string = "cui-sheet-header";
export const overlay: string = "cui-sheet-overlay";
export const title: string = "cui-sheet-title";
