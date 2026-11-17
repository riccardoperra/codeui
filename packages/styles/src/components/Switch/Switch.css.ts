import { recipe } from "../../recipe";
export const control = recipe({
	defaultClassName: "cui-switch-control",
	variantClassNames: {
		size: { sm: "cui-switch-control_size_sm", md: "cui-switch-control_size_md" },
	},
	defaultVariants: {},
});
export const description: string = "cui-switch-description";
export const errorMessage: string = "cui-switch-errorMessage";
export const input: string = "cui-switch-input";
export const label: string = "cui-switch-label";
export const root: string = "cui-switch-root";
export const thumb = recipe({
	defaultClassName: "cui-switch-thumb",
	variantClassNames: {
		size: { sm: "cui-switch-thumb_size_sm", md: "cui-switch-thumb_size_md" },
	},
	defaultVariants: {},
});
