import { recipe } from "../../recipe";
export const root = recipe({
	defaultClassName: "cui-skeleton-base",
	variantClassNames: {
		circle: { true: "cui-skeleton-root_circle_true" },
		animate: { true: "cui-skeleton-root_animate_true" },
	},
	defaultVariants: { animate: true },
});
