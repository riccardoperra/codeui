import { createTheme, recipe } from "../../foundation/layer.css";
import { RecipeVariants } from "@vanilla-extract/recipes";

const [linkTheme] = createTheme({}, "linkTheme");

export const link = recipe(
	{
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
	},
	"link",
);

export type LinkVariants = RecipeVariants<typeof link>;
