import { recipe } from "../../recipe";
export const root = recipe({
	defaultClassName: "cui-text-root",
	variantClassNames: {
		size: {
			badge: "cui-text-root_size_badge",
			xs: "cui-text-root_size_xs",
			caption: "cui-text-root_size_caption",
			sm: "cui-text-root_size_sm",
			md: "cui-text-root_size_md",
			lg: "cui-text-root_size_lg",
			xl: "cui-text-root_size_xl",
			"2xl": "cui-text-root_size_2xl",
		},
		weight: {
			normal: "cui-text-root_weight_normal",
			medium: "cui-text-root_weight_medium",
			semibold: "cui-text-root_weight_semibold",
		},
		tone: {
			default: "cui-text-root_tone_default",
			muted: "cui-text-root_tone_muted",
			hint: "cui-text-root_tone_hint",
			label: "cui-text-root_tone_label",
			danger: "cui-text-root_tone_danger",
			success: "cui-text-root_tone_success",
		},
	},
	defaultVariants: { size: "sm", weight: "normal", tone: "default" },
	compoundVariants: [],
});
