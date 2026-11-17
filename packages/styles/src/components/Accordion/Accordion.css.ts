import { recipe } from "../../recipe";
export const chevron: string = "cui-accordion-chevron";
export const content: string = "cui-accordion-content";
export const contentBody: string = "cui-accordion-contentBody";
export const header: string = "cui-accordion-header";
export const icon: string = "cui-accordion-icon";
export const item: string = "cui-accordion-item";
export const root: string = "cui-accordion-root";
export const summary: string = "cui-accordion-summary";
export const title: string = "cui-accordion-title";
export const trigger = recipe({
	defaultClassName: "cui-accordion-trigger",
	variantClassNames: {
		density: {
			compact: "cui-accordion-trigger_density_compact",
			comfortable: "cui-accordion-trigger_density_comfortable",
		},
	},
	defaultVariants: {},
});
