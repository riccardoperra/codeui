import { recipe } from "../../foundation/layer.css";
import { tokens } from "../../foundation/cui.css";

const sizes = Object.fromEntries(
	Object.entries(tokens.font.size).map(([key, value]) => [key, { fontSize: value }]),
) as Record<keyof typeof tokens.font.size, { fontSize: string }>;
const weights = Object.fromEntries(
	Object.entries(tokens.font.weight).map(([key, value]) => [key, { fontWeight: value }]),
) as Record<keyof typeof tokens.font.weight, { fontWeight: string }>;

/** `textStyles.root(variants)` and `<Text>` share these classes. */
export const root = recipe(
	{
		base: {
			fontFamily: tokens.font.family.sans,
			lineHeight: tokens.font.lineHeight.normal,
		},
		variants: {
			size: sizes,
			weight: weights,
			tone: {
				default: { color: tokens.text.default },
				muted: { color: tokens.text.muted },
				hint: { color: tokens.text.hint },
				label: { color: tokens.text.label },
				danger: { color: tokens.text.danger },
				success: {
					color: `color-mix(in srgb, ${tokens.action.success.active} 85%, ${tokens.text.panel})`,
				},
			},
		},
		defaultVariants: { size: "sm", weight: "normal", tone: "default" },
	},
	"root",
);
