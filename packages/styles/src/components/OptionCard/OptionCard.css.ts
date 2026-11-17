import { recipe } from "../../recipe";
export const badge: string = "cui-option-card-badge";
export const description: string = "cui-option-card-description";
export const errorMessage: string = "cui-option-card-errorMessage";
export const item: string = "cui-option-card-item";
export const itemControl: string = "cui-option-card-itemControl";
export const itemDescription: string = "cui-option-card-itemDescription";
export const itemIndicator: string = "cui-option-card-itemIndicator";
export const itemInput: string = "cui-option-card-itemInput";
export const itemLabel = recipe({
	defaultClassName: "cui-option-card-itemLabel",
	variantClassNames: {
		variant: {
			card: "cui-option-card-itemLabel_variant_card",
			tile: "cui-option-card-itemLabel_variant_tile",
		},
	},
	defaultVariants: {},
});
export const itemName: string = "cui-option-card-itemName";
export const itemText: string = "cui-option-card-itemText";
export const label: string = "cui-option-card-label";
export const preview: string = "cui-option-card-preview";
export const root: string = "cui-option-card-root";
