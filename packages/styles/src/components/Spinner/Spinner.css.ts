import { recipe } from "../../recipe";
export const indicator: string = "cui-spinner-indicator";
export const root = recipe({
	defaultClassName: "cui-spinner-root",
	variantClassNames: {
		size: {
			sm: "cui-spinner-root_size_sm",
			md: "cui-spinner-root_size_md",
			lg: "cui-spinner-root_size_lg",
		},
	},
	defaultVariants: { size: "md" },
});
export const track: string = "cui-spinner-track";
