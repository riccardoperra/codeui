import { recipe } from "../../recipe";
export const description: string = "cui-slider-description";
export const errorMessage: string = "cui-slider-errorMessage";
export const fill = recipe({
	defaultClassName: "cui-slider-fill",
	variantClassNames: {
		orientation: {
			horizontal: "cui-slider-fill_orientation_horizontal",
			vertical: "cui-slider-fill_orientation_vertical",
		},
	},
	defaultVariants: {},
	compoundVariants: [],
});
export const input: string = "cui-slider-input";
export const label: string = "cui-slider-label";
export const root: string = "cui-slider-root";
export const thumb: string = "cui-slider-thumb";
export const track = recipe({
	defaultClassName: "cui-slider-track",
	variantClassNames: {
		orientation: {
			horizontal: "cui-slider-track_orientation_horizontal",
			vertical: "cui-slider-track_orientation_vertical",
		},
	},
	defaultVariants: {},
	compoundVariants: [],
});
export const valueLabel: string = "cui-slider-valueLabel";
