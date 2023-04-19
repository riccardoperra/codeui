import { createTheme } from "@vanilla-extract/css";
import { recipe, RecipeVariants } from "@vanilla-extract/recipes";
import { themeTokens } from "../../foundation/themes.css";

const [linkTheme, linkVars] = createTheme({
	blockBorderRadius: themeTokens.radii.sm,
});

export const link = recipe({
	base: [
		linkTheme,
		{
			outline: "none",
			display: "inline-flex",
			alignItems: "center",
			lineHeight: "inherit",
			textDecoration: "none",
			color: "inherit",
			cursor: "pointer",
		},
	],

	variants: {
		variant: {
			underline: {
				":hover": {
					textDecoration: "underline",
				},
			},
		},
	},
});

export type LinkVariants = RecipeVariants<typeof link>;
