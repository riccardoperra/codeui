import { recipe } from "../../recipe";
export const fill: string = "cui-progress-fill";
export const label: string = "cui-progress-label";
export const root: string = "cui-progress-root";
export const track = recipe({
	defaultClassName: "cui-progress-track",
	variantClassNames: {
		size: { sm: "cui-progress-track_size_sm", md: "cui-progress-track_size_md" },
	},
	defaultVariants: {},
	compoundVariants: [],
});
export const valueLabel: string = "cui-progress-valueLabel";
