import { recipe } from "../../recipe";
export const root = recipe({
	defaultClassName: "cui-kbd-root",
	variantClassNames: {
		size: { sm: "cui-kbd-root_size_sm", md: "cui-kbd-root_size_md" },
		variant: { keycap: "cui-kbd-root_variant_keycap", hint: "cui-kbd-root_variant_hint" },
	},
	defaultVariants: { size: "sm", variant: "keycap" },
});
