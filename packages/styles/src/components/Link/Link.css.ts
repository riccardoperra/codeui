import type { RecipeVariants } from "../../types";
import { recipe } from "../../recipe";
export const link = recipe({
	defaultClassName: "cui-link-link cui-link-linkTheme",
	variantClassNames: { variant: { underline: "cui-link-link_variant_underline" } },
	defaultVariants: {},
});

export type LinkVariants = RecipeVariants<typeof link>;
