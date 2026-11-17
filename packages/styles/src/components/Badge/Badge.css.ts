import { recipe } from "../../recipe";
export const icon: string = "cui-badge-icon";
export const label: string = "cui-badge-label";
export const root = recipe({
	defaultClassName: "cui-badge-root",
	variantClassNames: {
		size: { sm: "cui-badge-root_size_sm", md: "cui-badge-root_size_md" },
		tone: {
			neutral: "cui-badge-root_tone_neutral",
			info: "cui-badge-root_tone_info",
			success: "cui-badge-root_tone_success",
			warning: "cui-badge-root_tone_warning",
			danger: "cui-badge-root_tone_danger",
		},
		variant: {
			soft: "cui-badge-root_variant_soft",
			outline: "cui-badge-root_variant_outline",
		},
	},
	defaultVariants: { size: "sm", tone: "neutral", variant: "soft" },
});
