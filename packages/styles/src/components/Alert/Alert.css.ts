import { recipe } from "../../recipe";
export const action: string = "cui-alert-action";
export const description: string = "cui-alert-description";
export const icon: string = "cui-alert-icon";
export const root = recipe({
	defaultClassName: "cui-alert-root",
	variantClassNames: {
		tone: {
			neutral: "cui-alert-root_tone_neutral",
			info: "cui-alert-root_tone_info",
			success: "cui-alert-root_tone_success",
			warning: "cui-alert-root_tone_warning",
			danger: "cui-alert-root_tone_danger",
		},
		fluid: { true: "cui-alert-root_fluid_true", false: "cui-alert-root_fluid_false" },
	},
	defaultVariants: { tone: "neutral", fluid: false },
	compoundVariants: [],
});
export const title: string = "cui-alert-title";
