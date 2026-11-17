import { recipe } from "../../recipe";
export const action: string = "cui-toast-action";
export const closeButton: string = "cui-toast-closeButton";
export const description: string = "cui-toast-description";
export const icon: string = "cui-toast-icon";
export const list: string = "cui-toast-list";
export const progressFill: string = "cui-toast-progressFill";
export const progressTrack: string = "cui-toast-progressTrack";
export const region = recipe({
	defaultClassName: "cui-toast-region",
	variantClassNames: {
		position: {
			"top-left": "cui-toast-region_position_top-left",
			"top-center": "cui-toast-region_position_top-center",
			"top-right": "cui-toast-region_position_top-right",
			"bottom-left": "cui-toast-region_position_bottom-left",
			"bottom-center": "cui-toast-region_position_bottom-center",
			"bottom-right": "cui-toast-region_position_bottom-right",
		},
	},
	defaultVariants: { position: "bottom-center" },
	compoundVariants: [],
});
export const root = recipe({
	defaultClassName: "cui-toast-root",
	variantClassNames: {
		tone: {
			neutral: "cui-toast-root_tone_neutral",
			info: "cui-toast-root_tone_info",
			success: "cui-toast-root_tone_success",
			warning: "cui-toast-root_tone_warning",
			danger: "cui-toast-root_tone_danger",
		},
	},
	defaultVariants: { tone: "neutral" },
	compoundVariants: [],
});
export const title: string = "cui-toast-title";
