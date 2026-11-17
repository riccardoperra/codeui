import { recipe } from "../../foundation/layer.css";
import { tokens } from "../../foundation/cui.css";

const gaps = Object.fromEntries(
	Object.entries(tokens.space).map(([key, value]) => [key, { gap: value }]),
) as Record<keyof typeof tokens.space, { gap: string }>;

/** `stackStyles.root(variants)` and `<Stack>` share these classes. */
export const root = recipe(
	{
		base: { display: "flex" },
		variants: {
			gap: gaps,
			direction: {
				column: { flexDirection: "column" },
				row: { flexDirection: "row" },
			},
			wrap: {
				true: { flexWrap: "wrap" },
				false: { flexWrap: "nowrap" },
			},
			align: {
				start: { alignItems: "flex-start" },
				center: { alignItems: "center" },
				end: { alignItems: "flex-end" },
				stretch: { alignItems: "stretch" },
				baseline: { alignItems: "baseline" },
			},
			justify: {
				start: { justifyContent: "flex-start" },
				center: { justifyContent: "center" },
				end: { justifyContent: "flex-end" },
				between: { justifyContent: "space-between" },
				around: { justifyContent: "space-around" },
				evenly: { justifyContent: "space-evenly" },
			},
		},
		defaultVariants: {
			gap: "2",
			direction: "column",
			wrap: false,
			align: "stretch",
			justify: "start",
		},
	},
	"root",
);
